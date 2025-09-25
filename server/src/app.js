const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { generalLimiter } = require('./middleware/rateLimit.middleware');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Environment variables
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy - required for express-rate-limit behind proxy
app.set('trust proxy', 1);

// Middleware
app.use(helmet()); // Security headers

// CORS configuration for Codespace and local development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and codespace URLs
    if (origin.includes('localhost') || origin.includes('github.dev') || origin.includes('app.github.dev')) {
      return callback(null, true);
    }
    
    // Fallback to environment variable
    if (origin === (process.env.CLIENT_URL || 'http://localhost:5173')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions)); // Enable CORS with credentials

// Apply global rate limiting
app.use(generalLimiter);

// Body parser middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(cookieParser());

// HTTP request logger
app.use(morgan('dev'));

// Admin API routes
app.use('/api/admin/auth', require('./routes/admin/auth.routes'));
app.use('/api/admin/users', require('./routes/admin/users.routes'));
app.use('/api/admin/dashboard', require('./routes/admin/dashboard.routes'));

// Buyer API routes
app.use('/api/buyer/auth', require('./routes/buyer/auth.routes'));
app.use('/api/buyer/products', require('./routes/buyer/product.routes'));
app.use('/api/buyer/cart', require('./routes/buyer/cart.routes'));
app.use('/api/buyer/profile', require('./routes/buyer/profile.routes'));
app.use('/api/buyer/wishlist', require('./routes/buyer/wishlist.routes'));
app.use('/api/buyer/reviews', require('./routes/buyer/review.routes'));

// Seller API routes
app.use('/api/seller/auth', require('./routes/seller/auth.routes'));
app.use('/api/seller/products', require('./routes/seller/products.routes'));

// Repair Center API routes
app.use('/api/repair-center/auth', require('./routes/repairCenter/auth.routes'));
app.use('/api/repair-center/requests', require('./routes/repairCenter/repairRequests.routes'));

// Serve static files in production
if (NODE_ENV === 'production') {
  // For Vite projects, the build folder is 'dist'
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

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

// Export app for testing and starting the server
module.exports = app;