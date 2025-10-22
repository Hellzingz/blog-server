// Common validation middleware for reusable validation logic

// Validate required fields
export const validateRequired = (fields) => {
  return (req, res, next) => {
    const missingFields = [];
    
    for (const field of fields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Required fields missing: ${missingFields.join(', ')}`,
        missingFields
      });
    }
    
    next();
  };
};

// Validate field types
export const validateTypes = (fieldTypes) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, expectedType] of Object.entries(fieldTypes)) {
      const value = req.body[field];
      
      if (value !== undefined && value !== null) {
        if (expectedType === 'string' && typeof value !== 'string') {
          errors.push(`${field} must be a string`);
        } else if (expectedType === 'number' && isNaN(Number(value))) {
          errors.push(`${field} must be a number`);
        } else if (expectedType === 'email' && !isValidEmail(value)) {
          errors.push(`${field} must be a valid email`);
        }
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation errors',
        errors
      });
    }
    
    next();
  };
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (req, res, next) => {
  const { password } = req.body;
  
  if (password) {
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }
  }
  
  next();
};

// Validate username format
export const validateUsername = (req, res, next) => {
  const { username } = req.body;
  
  if (username) {
    if (username.length < 3) {
      return res.status(400).json({
        message: 'Username must be at least 3 characters long'
      });
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        message: 'Username can only contain letters, numbers, and underscores'
      });
    }
  }
  
  next();
};

// Validate comment data
export const validateComment = (req, res, next) => {
  const { comment_text } = req.body;
  
  if (!comment_text || typeof comment_text !== 'string') {
    return res.status(400).json({
      message: 'Comment text is required and must be a string'
    });
  }
  
  if (comment_text.trim().length === 0) {
    return res.status(400).json({
      message: 'Comment text cannot be empty'
    });
  }
  
  next();
};

// Validate post ID parameter
export const validatePostId = (req, res, next) => {
  const { postId } = req.params;
  
  if (!postId || isNaN(Number(postId))) {
    return res.status(400).json({
      message: 'Valid post ID is required'
    });
  }
  
  next();
};

// Validate user ID parameter (UUID format)
export const validateUserId = (req, res, next) => {
  const { userId } = req.params;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!userId || !uuidRegex.test(userId)) {
    return res.status(400).json({
      message: 'Valid user ID (UUID) is required'
    });
  }
  
  next();
};
