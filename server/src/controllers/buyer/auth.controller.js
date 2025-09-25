const { User } = require('../../database/models');
const { generateAccessToken, generateRefreshToken } = require('../../services/auth.service');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // We'll need to install this

// Register new buyer
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Validate required fields
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
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Create user with buyer role
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by model hook
      phone: phone || null,
      role: 'buyer',
      status: 'unverified',
      verificationToken,
      verificationExpires
    });
    
    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);
    
    // Return user data without sensitive fields
    const userData = user.toJSON();
    delete userData.password;
    delete userData.verificationToken;
    
    return res.status(201).json({
      error: false,
      message: 'Registration successful. Please check your email to verify your account.',
      user: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred during registration'
    });
  }
};

// Login buyer
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
    
    // Find user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({
        error: true,
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }
    
    // Check if account is verified
    if (user.status === 'unverified') {
      return res.status(401).json({
        error: true,
        code: 'UNVERIFIED_ACCOUNT',
        message: 'Please verify your email before logging in'
      });
    }
    
    // Check if account is suspended
    if (user.status === 'suspended') {
      return res.status(403).json({
        error: true,
        code: 'ACCOUNT_SUSPENDED',
        message: 'Your account has been suspended'
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(
      user,
      req.body.deviceId || null,
      req.ip,
      req.headers['user-agent']
    );
    
    // Update last login
    await user.update({ lastLogin: new Date() });
    
    // Return tokens and user data
    const userData = user.toJSON();
    delete userData.password;
    
    return res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred during login'
    });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_TOKEN',
        message: 'Verification token is required'
      });
    }
    
    // Find user with token
    const user = await User.findOne({ 
      where: { 
        verificationToken: token,
        verificationExpires: { $gt: new Date() }
      }
    });
    
    if (!user) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired verification token'
      });
    }
    
    // Update user status to verified
    await user.update({
      status: 'active',
      verificationToken: null,
      verificationExpires: null,
      emailVerified: true,
      emailVerifiedAt: new Date()
    });
    
    return res.status(200).json({
      error: false,
      message: 'Email verification successful. You can now log in.'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred during email verification'
    });
  }
};

// Request password reset
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_EMAIL',
        message: 'Email is required'
      });
    }
    
    // Find user
    const user = await User.findOne({ where: { email } });
    
    // Don't reveal if user exists or not for security
    if (!user) {
      return res.status(200).json({
        error: false,
        message: 'If your email is registered, you will receive a password reset link'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    
    // Update user with reset token
    await user.update({
      resetToken,
      resetExpires
    });
    
    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken);
    
    return res.status(200).json({
      error: false,
      message: 'If your email is registered, you will receive a password reset link'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred during password reset request'
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'Token and new password are required'
      });
    }
    
    // Find user with token
    const user = await User.findOne({ 
      where: { 
        resetToken: token,
        resetExpires: { $gt: new Date() }
      }
    });
    
    if (!user) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired reset token'
      });
    }
    
    // Update password and clear token
    user.password = password; // Will be hashed by model hook
    user.resetToken = null;
    user.resetExpires = null;
    user.passwordChangedAt = new Date();
    
    await user.save();
    
    return res.status(200).json({
      error: false,
      message: 'Password reset successful. You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred during password reset'
    });
  }
};

// Send verification email (helper function)
const sendVerificationEmail = async (email, token) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || 'user@example.com',
        pass: process.env.EMAIL_PASS || 'password'
      }
    });
    
    // Verification URL
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"E-Waste Marketplace" <no-reply@example.com>',
      to: email,
      subject: 'Verify your email address',
      html: `
        <h1>Email Verification</h1>
        <p>Thank you for registering. Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    });
  } catch (error) {
    console.error('Send verification email error:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email (helper function)
const sendPasswordResetEmail = async (email, token) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || 'user@example.com',
        pass: process.env.EMAIL_PASS || 'password'
      }
    });
    
    // Reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"E-Waste Marketplace" <no-reply@example.com>',
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    });
  } catch (error) {
    console.error('Send password reset email error:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Refresh access token using refresh token
const refreshToken = async (req, res) => {
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
    const { validateRefreshToken } = require('../../middleware/auth.middleware');
    const validation = await validateRefreshToken(refreshToken);
    
    if (!validation.valid) {
      return res.status(401).json({
        error: true,
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Invalid refresh token'
      });
    }
    
    // Generate new access token
    const accessToken = generateAccessToken(validation.user);
    
    // Return the new access token
    return res.json({
      error: false,
      accessToken,
      message: 'Access token refreshed successfully'
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while refreshing token'
    });
  }
};

// Logout user (invalidate refresh token)
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      // Find and remove the refresh token
      await RefreshToken.destroy({
        where: { token: refreshToken }
      });
    }
    
    return res.json({
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

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout
};