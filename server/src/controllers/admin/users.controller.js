const { User, Admin } = require('../../database/models');
const { Op } = require('sequelize');

// Get all users with pagination and filtering
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || null;
    const role = req.query.role || null;
    
    // Build query conditions
    const whereConditions = {};
    
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status) {
      whereConditions.status = status;
    }
    
    if (role) {
      whereConditions.role = role;
    }
    
    // Query users
    const { count, rows: users } = await User.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });
    
    const totalPages = Math.ceil(count / limit);
    
    return res.status(200).json({
      error: false,
      users,
      pagination: {
        total: count,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching users'
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Admin,
          required: false
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      error: false,
      user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching user'
    });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, status } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'Name, email, and password are required'
      });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({
        error: true,
        code: 'EMAIL_EXISTS',
        message: 'Email already in use'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      phone: phone || null,
      password, // This will be hashed by the model hook
      role: role || 'user',
      status: status || 'active'
    });
    
    // If role is admin, create admin profile
    if (role === 'admin') {
      await Admin.create({
        userId: user.id,
        mfaEnabled: false
      });
    }
    
    // Return user data without password
    const userData = user.toJSON();
    delete userData.password;
    
    return res.status(201).json({
      error: false,
      message: 'User created successfully',
      user: userData
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while creating user'
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, role, status } = req.body;
    
    // Find user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }
    
    // Check if email is changing and already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      
      if (existingUser) {
        return res.status(400).json({
          error: true,
          code: 'EMAIL_EXISTS',
          message: 'Email already in use'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (status) updateData.status = status;
    
    // Handle role change
    if (role && role !== user.role) {
      updateData.role = role;
      
      // If changing to admin, create admin profile
      if (role === 'admin') {
        await Admin.findOrCreate({
          where: { userId: user.id },
          defaults: {
            userId: user.id,
            mfaEnabled: false
          }
        });
      }
      
      // If changing from admin to another role, don't delete the admin profile
      // just in case they need to be re-elevated later
    }
    
    // Update user
    await user.update(updateData);
    
    // Return updated user data
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Admin,
          required: false
        }
      ]
    });
    
    return res.status(200).json({
      error: false,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while updating user'
    });
  }
};

// Reset user password
const resetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'New password is required'
      });
    }
    
    // Find user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }
    
    // Update password
    user.password = newPassword; // Will be hashed by model hook
    await user.save();
    
    return res.status(200).json({
      error: false,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while resetting password'
    });
  }
};

// Delete user (soft delete)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }
    
    // Soft delete by changing status
    await user.update({ status: 'deleted' });
    
    return res.status(200).json({
      error: false,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while deleting user'
    });
  }
};

// Get user activity logs
const getUserActivityLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Check if user exists
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }
    
    // Get audit logs for user
    const { AuditLog } = require('../../database/models');
    
    const { count, rows: logs } = await AuditLog.findAndCountAll({
      where: { userId },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    const totalPages = Math.ceil(count / limit);
    
    return res.status(200).json({
      error: false,
      logs,
      pagination: {
        total: count,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get user activity logs error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching user activity logs'
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  resetUserPassword,
  deleteUser,
  getUserActivityLogs
};