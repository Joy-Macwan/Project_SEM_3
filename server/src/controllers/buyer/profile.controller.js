const { User, Address } = require('../../database/models');
const { authenticateToken } = require('../../middleware/auth.middleware');
const bcrypt = require('bcryptjs');

// Get buyer profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find user with addresses
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'resetToken', 'resetExpires', 'verificationToken', 'verificationExpires'] },
      include: [
        {
          model: Address,
          as: 'addresses'
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
    console.error('Get profile error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching profile'
    });
  }
};

// Update buyer profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;
    
    // Find user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }
    
    // Update user
    await user.update({
      name: name || user.name,
      phone: phone || user.phone
    });
    
    // Return updated user without sensitive fields
    const userData = user.toJSON();
    delete userData.password;
    delete userData.resetToken;
    delete userData.resetExpires;
    delete userData.verificationToken;
    delete userData.verificationExpires;
    
    return res.status(200).json({
      error: false,
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while updating profile'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'Current password and new password are required'
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
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        code: 'INVALID_PASSWORD',
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword; // Will be hashed by model hook
    user.passwordChangedAt = new Date();
    
    await user.save();
    
    return res.status(200).json({
      error: false,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while changing password'
    });
  }
};

// Get addresses
const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find addresses
    const addresses = await Address.findAll({
      where: { userId }
    });
    
    return res.status(200).json({
      error: false,
      addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching addresses'
    });
  }
};

// Add address
const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      name, 
      phone, 
      addressLine1, 
      addressLine2, 
      city, 
      state, 
      postalCode, 
      country,
      isDefault 
    } = req.body;
    
    // Validate required fields
    if (!name || !phone || !addressLine1 || !city || !state || !postalCode || !country) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'Required address fields are missing'
      });
    }
    
    // If this is the first address or isDefault is true, update existing default address
    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId, isDefault: true } }
      );
    }
    
    // Check if this is the first address
    const addressCount = await Address.count({ where: { userId } });
    const makeDefault = addressCount === 0 ? true : isDefault;
    
    // Create address
    const address = await Address.create({
      userId,
      name,
      phone,
      addressLine1,
      addressLine2: addressLine2 || null,
      city,
      state,
      postalCode,
      country,
      isDefault: makeDefault
    });
    
    return res.status(201).json({
      error: false,
      message: 'Address added successfully',
      address
    });
  } catch (error) {
    console.error('Add address error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while adding address'
    });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { 
      name, 
      phone, 
      addressLine1, 
      addressLine2, 
      city, 
      state, 
      postalCode, 
      country,
      isDefault 
    } = req.body;
    
    // Find address
    const address = await Address.findOne({
      where: { id: addressId, userId }
    });
    
    if (!address) {
      return res.status(404).json({
        error: true,
        code: 'ADDRESS_NOT_FOUND',
        message: 'Address not found'
      });
    }
    
    // If setting as default, update existing default address
    if (isDefault && !address.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId, isDefault: true } }
      );
    }
    
    // Update address
    await address.update({
      name: name || address.name,
      phone: phone || address.phone,
      addressLine1: addressLine1 || address.addressLine1,
      addressLine2: addressLine2 || address.addressLine2,
      city: city || address.city,
      state: state || address.state,
      postalCode: postalCode || address.postalCode,
      country: country || address.country,
      isDefault: isDefault !== undefined ? isDefault : address.isDefault
    });
    
    return res.status(200).json({
      error: false,
      message: 'Address updated successfully',
      address
    });
  } catch (error) {
    console.error('Update address error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while updating address'
    });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    
    // Find address
    const address = await Address.findOne({
      where: { id: addressId, userId }
    });
    
    if (!address) {
      return res.status(404).json({
        error: true,
        code: 'ADDRESS_NOT_FOUND',
        message: 'Address not found'
      });
    }
    
    // Check if this is the default address
    const wasDefault = address.isDefault;
    
    // Delete address
    await address.destroy();
    
    // If deleted address was default, set another address as default
    if (wasDefault) {
      const anotherAddress = await Address.findOne({
        where: { userId }
      });
      
      if (anotherAddress) {
        await anotherAddress.update({ isDefault: true });
      }
    }
    
    return res.status(200).json({
      error: false,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while deleting address'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};