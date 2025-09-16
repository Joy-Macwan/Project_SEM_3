const { AuditLog } = require('../database/models');

// Middleware to create audit logs for admin actions
const auditLog = (actionType) => {
  return async (req, res, next) => {
    // Store the original send function
    const originalSend = res.send;
    
    // Override the send function to capture the response
    res.send = function (body) {
      try {
        // Parse the response body (assuming it's JSON)
        const responseBody = typeof body === 'string' ? JSON.parse(body) : body;
        
        // Only log if the action was successful
        if (!responseBody.error) {
          const userId = req.user ? req.user.id : null;
          
          if (!userId) {
            console.warn('Audit log failed: No user ID found in request');
          } else {
            // Extract target details from request parameters or body
            const targetId = req.params.id || req.body.id || null;
            const targetType = actionType.split('_')[0] || 'unknown';
            
            // Create audit log entry
            AuditLog.create({
              userId,
              action: actionType,
              targetType,
              targetId,
              beforeSnapshot: JSON.stringify(req.body),
              afterSnapshot: JSON.stringify(responseBody),
              ip: req.ip,
              userAgent: req.headers['user-agent'] || 'unknown'
            }).catch(err => {
              console.error('Error creating audit log:', err);
            });
          }
        }
      } catch (error) {
        console.error('Error in audit log middleware:', error);
      }
      
      // Call the original send function
      return originalSend.call(this, body);
    };
    
    next();
  };
};

module.exports = { auditLog };