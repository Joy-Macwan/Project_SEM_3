const { User, Seller, RefreshToken } = require('../../database/allModels');
const { generateAccessToken, generateRefreshToken } = require('../../services/auth.service');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // We'll need to install this

// Register new seller
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
      contactPhone 
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
    
    // Create user with seller role
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by model hook
      phone: phone || null,
      role: 'seller',
      status: 'unverified',
      verificationToken,
      verificationExpires
    });
    
    // Create seller profile
    await Seller.create({
      userId: user.id,
      businessName,
      businessAddress,
      taxId,
      contactPhone: contactPhone || phone,
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
    console.error('Seller registration error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred during registration'
    });
  }
};

// Login seller
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
      where: { email, role: 'seller' },
      include: [{ model: Seller }]
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
    console.error('Seller login error:', error);
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
        role: 'seller',
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
        where: { role: 'seller' },
        include: [{ model: Seller }]
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
    
    // Find seller
    const seller = await Seller.findOne({ where: { userId } });
    
    if (!seller) {
      return res.status(404).json({
        error: true,
        code: 'SELLER_NOT_FOUND',
        message: 'Seller profile not found'
      });
    }
    
    // Check if already verified
    if (seller.kycStatus === 'approved') {
      return res.status(400).json({
        error: true,
        code: 'ALREADY_VERIFIED',
        message: 'Seller is already verified'
      });
    }
    
    // Update seller profile
    await seller.update({
      businessName,
      businessAddress,
      taxId,
      contactPhone,
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
    
    // Find seller
    const seller = await Seller.findOne({ where: { userId } });
    
    if (!seller) {
      return res.status(404).json({
        error: true,
        code: 'SELLER_NOT_FOUND',
        message: 'Seller profile not found'
      });
    }
    
    // Get documents
    const { KycDocument } = require('../../database/allModels');
    const documents = await KycDocument.findAll({ where: { userId } });
    
    return res.status(200).json({
      error: false,
      kycStatus: seller.kycStatus,
      kycApprovedAt: seller.kycApprovedAt,
      kycRejectionReason: seller.kycRejectionReason,
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
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/seller/verify-email/${token}`;
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"E-Waste Marketplace" <no-reply@example.com>',
      to: email,
      subject: 'Verify your seller account',
      html: `
        <h1>Seller Account Verification</h1>
        <p>Thank you for registering as a seller. Please click the link below to verify your email address:</p>
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