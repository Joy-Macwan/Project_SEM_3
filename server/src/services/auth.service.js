const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authenticator } = require('otplib');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { User, Admin, RefreshToken } = require('../database/models');

// Generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'admin'
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
};

// Generate refresh token
const generateRefreshToken = async (user, deviceId, ip, userAgent) => {
  const token = jwt.sign(
    { userId: user.id, tokenId: uuidv4() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d' }
  );
  
  // Calculate expiry date
  const expiryDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY) || 30;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);
  
  // Store refresh token in database
  await RefreshToken.create({
    userId: user.id,
    token,
    deviceId: deviceId || 'unknown',
    ip: ip || 'unknown',
    userAgent: userAgent || 'unknown',
    expiresAt
  });
  
  return token;
};

// Revoke refresh token
const revokeRefreshToken = async (token) => {
  try {
    await RefreshToken.destroy({
      where: { token }
    });
    return true;
  } catch (error) {
    console.error('Error revoking refresh token:', error);
    return false;
  }
};

// Rotate refresh token (revoke old one and generate new one)
const rotateRefreshToken = async (oldTokenId, user, deviceId, ip, userAgent) => {
  try {
    // Revoke old token
    await RefreshToken.destroy({
      where: { id: oldTokenId }
    });
    
    // Generate new token
    const newToken = await generateRefreshToken(user, deviceId, ip, userAgent);
    return newToken;
  } catch (error) {
    console.error('Error rotating refresh token:', error);
    throw error;
  }
};

// Verify password
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Generate MFA secret
const generateMfaSecret = () => {
  return authenticator.generateSecret();
};

// Generate MFA QR code
const generateMfaQrCode = async (email, secret) => {
  const appName = 'RepairReuseReduce';
  const otpAuthUrl = authenticator.keyuri(email, appName, secret);
  return await QRCode.toDataURL(otpAuthUrl);
};

// Verify MFA token
const verifyMfaToken = (token, secret) => {
  return authenticator.verify({ token, secret });
};

// Login user (email + password)
const loginUser = async (email, password) => {
  try {
    // Find user by email
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Admin,
          required: false
        }
      ]
    });
    
    if (!user) {
      return {
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      };
    }
    
    // Check if user is suspended
    if (user.status === 'suspended') {
      return {
        success: false,
        code: 'USER_SUSPENDED',
        message: 'Your account has been suspended'
      };
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return {
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials'
      };
    }
    
    // Check if MFA is required for admin
    if (user.role === 'admin' && user.Admin && user.Admin.mfaEnabled) {
      return {
        success: true,
        requireMfa: true,
        userId: user.id,
        email: user.email
      };
    }
    
    // Update last login
    await user.update({ lastLogin: new Date() });
    
    return {
      success: true,
      requireMfa: false,
      user
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      code: 'SERVER_ERROR',
      message: 'An error occurred during login'
    };
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
  rotateRefreshToken,
  verifyPassword,
  hashPassword,
  generateMfaSecret,
  generateMfaQrCode,
  verifyMfaToken,
  loginUser
};