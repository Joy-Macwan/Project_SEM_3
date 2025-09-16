const authService = require('../../services/auth.service');
const { User, Admin, RefreshToken } = require('../../database/models');
const { validateRefreshToken } = require('../../middleware/auth.middleware');

// Admin login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'Email and password are required'
      });
    }
    
    // Attempt login
    const loginResult = await authService.loginUser(email, password);
    
    if (!loginResult.success) {
      return res.status(401).json({
        error: true,
        code: loginResult.code,
        message: loginResult.message
      });
    }
    
    // Check if user is admin
    if (loginResult.user && loginResult.user.role !== 'admin') {
      return res.status(403).json({
        error: true,
        code: 'ADMIN_REQUIRED',
        message: 'Admin access required'
      });
    }
    
    // If MFA is required, return requireMfa flag
    if (loginResult.requireMfa) {
      return res.status(200).json({
        error: false,
        requireMfa: true,
        userId: loginResult.userId,
        email: loginResult.email
      });
    }
    
    // Generate tokens
    const accessToken = authService.generateAccessToken(loginResult.user);
    const refreshToken = await authService.generateRefreshToken(
      loginResult.user,
      req.body.deviceId || null,
      req.ip,
      req.headers['user-agent']
    );
    
    // Return tokens
    return res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      user: {
        id: loginResult.user.id,
        name: loginResult.user.name,
        email: loginResult.user.email,
        role: loginResult.user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred during login'
    });
  }
};

// Verify MFA code
const verifyMfa = async (req, res) => {
  try {
    const { userId, code } = req.body;
    
    // Validate input
    if (!userId || !code) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'User ID and MFA code are required'
      });
    }
    
    // Find user and admin profile
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Admin,
          required: true
        }
      ]
    });
    
    if (!user || user.role !== 'admin') {
      return res.status(401).json({
        error: true,
        code: 'USER_NOT_FOUND',
        message: 'User not found or not an admin'
      });
    }
    
    // Verify MFA code
    const isValid = authService.verifyMfaToken(code, user.Admin.mfaSecret);
    
    if (!isValid) {
      return res.status(401).json({
        error: true,
        code: 'INVALID_MFA_CODE',
        message: 'Invalid MFA code'
      });
    }
    
    // Update last login
    await user.update({ lastLogin: new Date() });
    
    // Generate tokens
    const accessToken = authService.generateAccessToken(user);
    const refreshToken = await authService.generateRefreshToken(
      user,
      req.body.deviceId || null,
      req.ip,
      req.headers['user-agent']
    );
    
    // Return tokens
    return res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('MFA verification error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred during MFA verification'
    });
  }
};

// Refresh access token
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_REFRESH_TOKEN',
        message: 'Refresh token is required'
      });
    }
    
    // Validate refresh token
    const validation = await validateRefreshToken(refreshToken);
    
    if (!validation.valid) {
      return res.status(401).json({
        error: true,
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Invalid or expired refresh token'
      });
    }
    
    // Check if user is admin
    if (validation.user.role !== 'admin') {
      return res.status(403).json({
        error: true,
        code: 'ADMIN_REQUIRED',
        message: 'Admin access required'
      });
    }
    
    // Generate new access token
    const accessToken = authService.generateAccessToken(validation.user);
    
    // Rotate refresh token
    const newRefreshToken = await authService.rotateRefreshToken(
      validation.tokenId,
      validation.user,
      req.body.deviceId || null,
      req.ip,
      req.headers['user-agent']
    );
    
    return res.status(200).json({
      error: false,
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred during token refresh'
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_REFRESH_TOKEN',
        message: 'Refresh token is required'
      });
    }
    
    // Revoke refresh token
    await authService.revokeRefreshToken(refreshToken);
    
    return res.status(200).json({
      error: false,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred during logout'
    });
  }
};

// Setup MFA
const setupMfa = async (req, res) => {
  try {
    // This endpoint requires authentication
    const userId = req.user.id;
    
    // Find admin profile
    const admin = await Admin.findOne({
      where: { userId }
    });
    
    if (!admin) {
      return res.status(404).json({
        error: true,
        code: 'ADMIN_NOT_FOUND',
        message: 'Admin profile not found'
      });
    }
    
    // Generate MFA secret
    const secret = authService.generateMfaSecret();
    
    // Generate QR code
    const qrCode = await authService.generateMfaQrCode(req.user.email, secret);
    
    // Store secret in session for verification (in a real app, this would be more secure)
    req.session.mfaSecret = secret;
    
    return res.status(200).json({
      error: false,
      qrCode,
      secret // Note: In production, you might not want to send the secret directly
    });
  } catch (error) {
    console.error('MFA setup error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred during MFA setup'
    });
  }
};

// Verify and enable MFA
const enableMfa = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!code) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'MFA code is required'
      });
    }
    
    // Get secret from session
    const secret = req.session.mfaSecret;
    
    if (!secret) {
      return res.status(400).json({
        error: true,
        code: 'MFA_SETUP_INCOMPLETE',
        message: 'MFA setup not initiated'
      });
    }
    
    // Verify MFA code
    const isValid = authService.verifyMfaToken(code, secret);
    
    if (!isValid) {
      return res.status(401).json({
        error: true,
        code: 'INVALID_MFA_CODE',
        message: 'Invalid MFA code'
      });
    }
    
    // Update admin profile with MFA secret
    await Admin.update(
      {
        mfaEnabled: true,
        mfaSecret: secret
      },
      {
        where: { userId }
      }
    );
    
    // Clear session
    delete req.session.mfaSecret;
    
    return res.status(200).json({
      error: false,
      message: 'MFA enabled successfully'
    });
  } catch (error) {
    console.error('MFA enable error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while enabling MFA'
    });
  }
};

// Disable MFA
const disableMfa = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Update admin profile
    await Admin.update(
      {
        mfaEnabled: false,
        mfaSecret: null
      },
      {
        where: { userId }
      }
    );
    
    return res.status(200).json({
      error: false,
      message: 'MFA disabled successfully'
    });
  } catch (error) {
    console.error('MFA disable error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while disabling MFA'
    });
  }
};

module.exports = {
  login,
  verifyMfa,
  refresh,
  logout,
  setupMfa,
  enableMfa,
  disableMfa
};