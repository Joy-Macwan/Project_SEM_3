const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { generalLimiter } = require('./middleware/rateLimit.middleware');
const path = require('path');

// Load environment variables
dotenv.config();

// Database connection
const db = require('./database/connection');

// Import initialization script
const { initialize } = require('./init');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Apply global rate limiter
app.use(generalLimiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Logging middleware
app.use(morgan('dev'));

// Admin API routes
app.use('/api/admin/auth', require('./routes/admin/auth.routes'));
app.use('/api/admin/users', require('./routes/admin/users.routes'));
app.use('/api/admin/kyc', require('./routes/admin/kyc.routes'));
app.use('/api/admin/products', require('./routes/admin/products.routes'));
app.use('/api/admin/orders', require('./routes/admin/orders.routes'));
app.use('/api/admin/repairs', require('./routes/admin/repairs.routes'));
app.use('/api/admin/payouts', require('./routes/admin/payouts.routes'));
app.use('/api/admin/reports', require('./routes/admin/reports.routes'));
app.use('/api/admin/system', require('./routes/admin/system.routes'));
app.use('/api/admin/notifications', require('./routes/admin/notifications.routes'));
app.use('/api/admin/audit-logs', require('./routes/admin/auditLogs.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    code: err.code || 'SERVER_ERROR',
    message: err.message || 'An unexpected error occurred',
    details: err.details || {}
  });
});

// Start the server
const PORT = process.env.PORT || 5000;

// Initialize the application and then start the server
initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize application:', err);
  process.exit(1);
});

module.exports = app;