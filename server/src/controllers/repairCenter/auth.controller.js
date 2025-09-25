const { User, RepairCenter, RefreshToken } = require('../../database/allModels');
const { generateAccessToken, generateRefreshToken } = require('../../services/auth.service');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // We'll need to install this

// Register new repair center
const register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      businessName, 
      businessAddress, 
      taxId, 
      contactPhone,
      serviceRadius
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !businessName) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'Name, email, password and business name are required'
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
    
    // Create user with repair center role
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by model hook
      phone: phone || null,
      role: 'repairCenter',
      status: 'unverified',
      verificationToken,
      verificationExpires
    });
    
    // Create repair center profile
    await RepairCenter.create({
      userId: user.id,
      businessName,
      businessAddress,
      taxId,
      contactPhone: contactPhone || phone,
      serviceRadius: serviceRadius || 10.0, // Default 10 mile radius
      kycStatus: 'pending'
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
    console.error('Repair center registration error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred during registration'
    });
  }
};

// Login repair center
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
    const user = await User.findOne({ 
      where: { email, role: 'repairCenter' },
      include: [{ model: RepairCenter }]
    });
    
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
    console.error('Repair center login error:', error);
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
        role: 'repairCenter',
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

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_TOKEN',
        message: 'Refresh token is required'
      });
    }
    
    // Find token in database
    const refreshTokenDoc = await RefreshToken.findOne({ 
      where: { token },
      include: [{ 
        model: User,
        where: { role: 'repairCenter' },
        include: [{ model: RepairCenter }]
      }]
    });
    
    if (!refreshTokenDoc) {
      return res.status(401).json({
        error: true,
        code: 'INVALID_TOKEN',
        message: 'Invalid refresh token'
      });
    }
    
    // Check if token is expired
    if (new Date() > refreshTokenDoc.expiresAt) {
      await refreshTokenDoc.destroy();
      return res.status(401).json({
        error: true,
        code: 'EXPIRED_TOKEN',
        message: 'Refresh token has expired'
      });
    }
    
    // Generate new access token
    const user = refreshTokenDoc.User;
    const accessToken = generateAccessToken(user);
    
    // Return new access token
    return res.status(200).json({
      error: false,
      accessToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
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
        code: 'MISSING_TOKEN',
        message: 'Refresh token is required'
      });
    }
    
    // Delete refresh token from database
    await RefreshToken.destroy({ where: { token: refreshToken } });
    
    return res.status(200).json({
      error: false,
      message: 'Logout successful'
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

// Apply for KYC verification
const applyForKYC = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      businessName, 
      businessAddress, 
      taxId, 
      contactPhone,
      serviceRadius,
      documents 
    } = req.body;
    
    // Validate required fields
    if (!businessName || !businessAddress || !taxId || !contactPhone || !documents) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'Business information and documents are required'
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
    
    // Check if already verified
    if (repairCenter.kycStatus === 'approved') {
      return res.status(400).json({
        error: true,
        code: 'ALREADY_VERIFIED',
        message: 'Repair center is already verified'
      });
    }
    
    // Update repair center profile
    await repairCenter.update({
      businessName,
      businessAddress,
      taxId,
      contactPhone,
      serviceRadius: serviceRadius || repairCenter.serviceRadius,
      kycStatus: 'pending'
    });
    
    // Save documents
    const { KycDocument } = require('../../database/allModels');
    
    for (const doc of documents) {
      await KycDocument.create({
        userId,
        documentType: doc.type,
        documentUrl: doc.url,
        status: 'pending'
      });
    }
    
    return res.status(200).json({
      error: false,
      message: 'KYC verification application submitted successfully'
    });
  } catch (error) {
    console.error('KYC application error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred during KYC application'
    });
  }
};

// Get KYC status
const getKYCStatus = async (req, res) => {
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
    
    // Get documents
    const { KycDocument } = require('../../database/allModels');
    const documents = await KycDocument.findAll({ where: { userId } });
    
    return res.status(200).json({
      error: false,
      kycStatus: repairCenter.kycStatus,
      kycApprovedAt: repairCenter.kycApprovedAt,
      kycRejectionReason: repairCenter.kycRejectionReason,
      documents
    });
  } catch (error) {
    console.error('Get KYC status error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while getting KYC status'
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
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/repair-center/verify-email/${token}`;
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"E-Waste Marketplace" <no-reply@example.com>',
      to: email,
      subject: 'Verify your repair center account',
      html: `
        <h1>Repair Center Account Verification</h1>
        <p>Thank you for registering as a repair center. Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    });
  } catch (error) {
    console.error('Send verification email error:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  refreshToken,
  logout,
  applyForKYC,
  getKYCStatus
};