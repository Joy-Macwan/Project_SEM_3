const { rateLimit } = require('express-rate-limit');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: true,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests, please try again later'
  }
});

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: true,
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    message: 'Too many authentication attempts, please try again later'
  }
});

// Limiter for financial/sensitive operations
const sensitiveOperationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: true,
    code: 'SENSITIVE_OPERATION_RATE_LIMIT_EXCEEDED',
    message: 'Too many sensitive operations, please try again later'
  }
});

// IP allowlist middleware for admin routes
const ipAllowlist = (allowlist) => {
  return (req, res, next) => {
    // Skip if no allowlist is defined or in development mode
    if (!allowlist || allowlist.length === 0 || process.env.NODE_ENV === 'development') {
      return next();
    }
    
    const clientIp = req.ip;
    
    if (!allowlist.includes(clientIp)) {
      return res.status(403).json({
        error: true,
        code: 'IP_NOT_ALLOWED',
        message: 'Access from this IP address is not allowed'
      });
    }
    
    next();
  };
};

module.exports = {
  generalLimiter,
  authLimiter,
  sensitiveOperationLimiter,
  ipAllowlist
};