const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/auth.middleware');
const { auditLog } = require('../../middleware/audit.middleware');
const repairRequestsController = require('../../controllers/repairCenter/repairRequests.controller');

// All routes require authentication
router.use(authenticateToken);

// Get all repair requests
router.get('/', repairRequestsController.getRepairRequests);

// Get repair request by ID
router.get('/:id', repairRequestsController.getRepairRequestById);

// Accept repair request
router.post('/:id/accept', auditLog('REPAIR_CENTER_ACCEPT_REQUEST'), repairRequestsController.acceptRepairRequest);

// Reject repair request
router.post('/:id/reject', auditLog('REPAIR_CENTER_REJECT_REQUEST'), repairRequestsController.rejectRepairRequest);

// Update repair request status
router.put('/:id/status', auditLog('REPAIR_CENTER_UPDATE_STATUS'), repairRequestsController.updateRepairStatus);

// Complete repair
router.post('/:id/complete', auditLog('REPAIR_CENTER_COMPLETE_REPAIR'), repairRequestsController.completeRepair);

module.exports = router;