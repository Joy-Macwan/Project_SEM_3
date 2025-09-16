const { 
  RepairRequest, 
  RepairCenter, 
  RepairQuote, 
  RepairLog, 
  RepairPart, 
  User, 
  Address 
} = require('../../database/allModels');
const { Op } = require('sequelize');

// Get all repair requests for a repair center
const getRepairRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find repair center
    const repairCenter = await RepairCenter.findOne({ where: { userId } });
    
    if (!repairCenter) {
      return res.status(404).json({
        error: true,
        code: 'REPAIR_CENTER_NOT_FOUND',
        message: 'Repair center profile not found'
      });
    }
    
    // Get query parameters for filtering and pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || null;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order || 'DESC';
    
    // Build where conditions
    const whereConditions = { repairCenterId: repairCenter.id };
    
    if (status) {
      whereConditions.status = status;
    }
    
    if (search) {
      whereConditions[Op.or] = [
        { deviceType: { [Op.like]: `%${search}%` } },
        { brand: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } },
        { issueDescription: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Query repair requests
    const { count, rows: repairRequests } = await RepairRequest.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: RepairQuote,
          required: false
        }
      ],
      order: [[sortBy, order]],
      limit,
      offset,
      distinct: true
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(count / limit);
    
    return res.status(200).json({
      error: false,
      repairRequests,
      pagination: {
        total: count,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get repair requests error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching repair requests'
    });
  }
};

// Get a single repair request by ID
const getRepairRequestById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Find repair center
    const repairCenter = await RepairCenter.findOne({ where: { userId } });
    
    if (!repairCenter) {
      return res.status(404).json({
        error: true,
        code: 'REPAIR_CENTER_NOT_FOUND',
        message: 'Repair center profile not found'
      });
    }
    
    // Find repair request
    const repairRequest = await RepairRequest.findOne({
      where: { 
        id,
        repairCenterId: repairCenter.id
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: RepairQuote,
          required: false
        },
        {
          model: RepairLog,
          required: false,
          include: [{ model: User, attributes: ['id', 'name'] }]
        },
        {
          model: RepairPart,
          required: false
        }
      ]
    });
    
    if (!repairRequest) {
      return res.status(404).json({
        error: true,
        code: 'REPAIR_REQUEST_NOT_FOUND',
        message: 'Repair request not found'
      });
    }
    
    // If there's an address ID, get the address
    let address = null;
    if (repairRequest.addressId) {
      address = await Address.findByPk(repairRequest.addressId);
    }
    
    // Add address to repair request
    const repairRequestData = repairRequest.toJSON();
    repairRequestData.address = address;
    
    return res.status(200).json({
      error: false,
      repairRequest: repairRequestData
    });
  } catch (error) {
    console.error('Get repair request error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching repair request'
    });
  }
};

// Accept a repair request
const acceptRepairRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { 
      laborCost, 
      partsCost, 
      taxAmount, 
      totalCost, 
      estimatedDays, 
      notes 
    } = req.body;
    
    // Validate required fields
    if (!laborCost || !partsCost || !totalCost || !estimatedDays) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'Labor cost, parts cost, total cost, and estimated days are required'
      });
    }
    
    // Find repair center
    const repairCenter = await RepairCenter.findOne({ where: { userId } });
    
    if (!repairCenter) {
      return res.status(404).json({
        error: true,
        code: 'REPAIR_CENTER_NOT_FOUND',
        message: 'Repair center profile not found'
      });
    }
    
    // Find repair request
    const repairRequest = await RepairRequest.findOne({
      where: { 
        id,
        repairCenterId: repairCenter.id
      }
    });
    
    if (!repairRequest) {
      return res.status(404).json({
        error: true,
        code: 'REPAIR_REQUEST_NOT_FOUND',
        message: 'Repair request not found'
      });
    }
    
    // Check if request is in the right status
    if (repairRequest.status !== 'pending') {
      return res.status(400).json({
        error: true,
        code: 'INVALID_STATUS',
        message: 'Repair request is not in pending status'
      });
    }
    
    // Calculate valid until date (7 days from now)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7);
    
    // Create repair quote
    const repairQuote = await RepairQuote.create({
      repairRequestId: repairRequest.id,
      repairCenterId: repairCenter.id,
      laborCost,
      partsCost,
      taxAmount: taxAmount || 0,
      totalCost,
      estimatedDays,
      validUntil,
      status: 'pending',
      notes: notes || ''
    });
    
    // Update repair request status
    await repairRequest.update({
      status: 'quoted'
    });
    
    // Add log entry
    await RepairLog.create({
      repairRequestId: repairRequest.id,
      userId,
      status: 'quoted',
      notes: 'Repair quote created'
    });
    
    return res.status(200).json({
      error: false,
      message: 'Repair request accepted and quote created',
      repairQuote
    });
  } catch (error) {
    console.error('Accept repair request error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while accepting repair request'
    });
  }
};

// Reject a repair request
const rejectRepairRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { reason } = req.body;
    
    // Validate required fields
    if (!reason) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'Rejection reason is required'
      });
    }
    
    // Find repair center
    const repairCenter = await RepairCenter.findOne({ where: { userId } });
    
    if (!repairCenter) {
      return res.status(404).json({
        error: true,
        code: 'REPAIR_CENTER_NOT_FOUND',
        message: 'Repair center profile not found'
      });
    }
    
    // Find repair request
    const repairRequest = await RepairRequest.findOne({
      where: { 
        id,
        repairCenterId: repairCenter.id
      }
    });
    
    if (!repairRequest) {
      return res.status(404).json({
        error: true,
        code: 'REPAIR_REQUEST_NOT_FOUND',
        message: 'Repair request not found'
      });
    }
    
    // Check if request is in the right status
    if (repairRequest.status !== 'pending') {
      return res.status(400).json({
        error: true,
        code: 'INVALID_STATUS',
        message: 'Repair request is not in pending status'
      });
    }
    
    // Update repair request status
    await repairRequest.update({
      status: 'cancelled'
    });
    
    // Add log entry
    await RepairLog.create({
      repairRequestId: repairRequest.id,
      userId,
      status: 'cancelled',
      notes: `Repair request rejected: ${reason}`
    });
    
    return res.status(200).json({
      error: false,
      message: 'Repair request rejected'
    });
  } catch (error) {
    console.error('Reject repair request error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while rejecting repair request'
    });
  }
};

// Update repair request status
const updateRepairStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status, notes } = req.body;
    
    // Validate required fields
    if (!status) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'Status is required'
      });
    }
    
    // Check if status is valid
    const validStatuses = [
      'in_progress', 
      'awaiting_parts', 
      'repaired', 
      'quality_check', 
      'completed'
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_STATUS',
        message: 'Invalid status'
      });
    }
    
    // Find repair center
    const repairCenter = await RepairCenter.findOne({ where: { userId } });
    
    if (!repairCenter) {
      return res.status(404).json({
        error: true,
        code: 'REPAIR_CENTER_NOT_FOUND',
        message: 'Repair center profile not found'
      });
    }
    
    // Find repair request
    const repairRequest = await RepairRequest.findOne({
      where: { 
        id,
        repairCenterId: repairCenter.id
      }
    });
    
    if (!repairRequest) {
      return res.status(404).json({
        error: true,
        code: 'REPAIR_REQUEST_NOT_FOUND',
        message: 'Repair request not found'
      });
    }
    
    // Check if request is in a valid status for updating
    const currentStatus = repairRequest.status;
    
    if (currentStatus === 'pending' || 
        currentStatus === 'cancelled' || 
        (currentStatus === 'completed' && status !== 'completed')) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_STATUS_TRANSITION',
        message: `Cannot update from ${currentStatus} to ${status}`
      });
    }
    
    // Check if we need to set completed date
    let completedDate = null;
    if (status === 'completed' && currentStatus !== 'completed') {
      completedDate = new Date();
    }
    
    // Update repair request status
    await repairRequest.update({
      status,
      completedDate
    });
    
    // Add log entry
    await RepairLog.create({
      repairRequestId: repairRequest.id,
      userId,
      status,
      notes: notes || `Status updated to ${status}`
    });
    
    return res.status(200).json({
      error: false,
      message: 'Repair request status updated',
      status
    });
  } catch (error) {
    console.error('Update repair status error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while updating repair status'
    });
  }
};

// Complete a repair
const completeRepair = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { notes } = req.body;
    
    // Find repair center
    const repairCenter = await RepairCenter.findOne({ where: { userId } });
    
    if (!repairCenter) {
      return res.status(404).json({
        error: true,
        code: 'REPAIR_CENTER_NOT_FOUND',
        message: 'Repair center profile not found'
      });
    }
    
    // Find repair request
    const repairRequest = await RepairRequest.findOne({
      where: { 
        id,
        repairCenterId: repairCenter.id
      },
      include: [
        {
          model: RepairQuote,
          required: true
        }
      ]
    });
    
    if (!repairRequest) {
      return res.status(404).json({
        error: true,
        code: 'REPAIR_REQUEST_NOT_FOUND',
        message: 'Repair request not found'
      });
    }
    
    // Check if repair is already completed
    if (repairRequest.status === 'completed') {
      return res.status(400).json({
        error: true,
        code: 'ALREADY_COMPLETED',
        message: 'Repair is already completed'
      });
    }
    
    // Check if repair is in a valid status for completion
    const validStatuses = ['repaired', 'quality_check'];
    
    if (!validStatuses.includes(repairRequest.status)) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_STATUS',
        message: 'Repair must be in repaired or quality_check status to complete'
      });
    }
    
    // Update repair request status
    await repairRequest.update({
      status: 'completed',
      completedDate: new Date()
    });
    
    // Add log entry
    await RepairLog.create({
      repairRequestId: repairRequest.id,
      userId,
      status: 'completed',
      notes: notes || 'Repair completed'
    });
    
    return res.status(200).json({
      error: false,
      message: 'Repair completed successfully'
    });
  } catch (error) {
    console.error('Complete repair error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while completing repair'
    });
  }
};

module.exports = {
  getRepairRequests,
  getRepairRequestById,
  acceptRepairRequest,
  rejectRepairRequest,
  updateRepairStatus,
  completeRepair
};