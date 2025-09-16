const jwt = require('jsonwebtoken');
const { User, RefreshToken, Admin } = require('../database/models');

// Middleware to validate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        error: true,
        code: 'TOKEN_MISSING',
        message: 'Authentication token is missing'
      });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      
      // Find the user
      const user = await User.findByPk(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          error: true,
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        });
      }
      
      // Check if user is suspended
      if (user.status === 'suspended') {
        return res.status(403).json({
          error: true,
          code: 'USER_SUSPENDED',
          message: 'Your account has been suspended'
        });
      }
      
      // Attach user to request
      req.user = user;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: true,
          code: 'TOKEN_EXPIRED',
          message: 'Authentication token expired'
        });
      }
      
      return res.status(403).json({
        error: true,
        code: 'TOKEN_INVALID',
        message: 'Invalid authentication token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while authenticating'
    });
  }
};

// Middleware to check if user is admin
const requireAdminRole = async (req, res, next) => {
  try {
    // Check if user exists and has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        error: true,
        code: 'ADMIN_REQUIRED',
        message: 'Admin access required'
      });
    }
    
    // Fetch admin details
    const admin = await Admin.findOne({ where: { userId: req.user.id } });
    
    if (!admin) {
      return res.status(403).json({
        error: true,
        code: 'ADMIN_NOT_FOUND',
        message: 'Admin profile not found'
      });
    }
    
    // Attach admin details to the request
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin role middleware error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while verifying admin role'
    });
  }
};

// Middleware to validate MFA for admin
const requireAdminMfa = async (req, res, next) => {
  try {
    // Check if admin exists and has MFA enabled
    if (!req.admin || !req.admin.mfaEnabled) {
      // If MFA is not enabled, just proceed
      return next();
    }
    
    // Check for MFA verification header
    const mfaVerified = req.headers['mfa-verified'];
    
    if (!mfaVerified || mfaVerified !== 'true') {
      return res.status(403).json({
        error: true,
        code: 'MFA_REQUIRED',
        message: 'MFA verification required',
        requireMfa: true
      });
    }
    
    next();
  } catch (error) {
    console.error('MFA middleware error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while verifying MFA'
    });
  }
};

// Check if refresh token is valid
const validateRefreshToken = async (token) => {
  try {
    // Find the token in the database
    const refreshTokenRecord = await RefreshToken.findOne({
      where: { token }
    });
    
    if (!refreshTokenRecord) {
      return { valid: false, error: 'Token not found' };
    }
    
    // Check if token is expired
    if (new Date(refreshTokenRecord.expiresAt) < new Date()) {
      return { valid: false, error: 'Token expired' };
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    // Find the user
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return { valid: false, error: 'User not found' };
    }
    
    if (user.status === 'suspended') {
      return { valid: false, error: 'User suspended' };
    }
    
    return { 
      valid: true, 
      userId: user.id,
      user,
      tokenId: refreshTokenRecord.id
    };
  } catch (error) {
    console.error('Refresh token validation error:', error);
    return { valid: false, error: 'Invalid token' };
  }
};

module.exports = {
  authenticateToken,
  requireAdminRole,
  requireAdminMfa,
  validateRefreshToken
};