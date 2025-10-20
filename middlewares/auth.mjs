import { validateRequired, validateTypes, validatePassword, validateUsername } from './validation.mjs';

// Validate registration data
export const validateRegistration = (req, res, next) => {
  const { email, password, username, name } = req.body;
  
  // Check required fields
  const requiredFields = ['email', 'password', 'username', 'name'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Required fields missing: ${missingFields.join(', ')}`,
      missingFields
    });
  }

  // Check field types
  const typeErrors = [];
  
  if (typeof email !== "string") {
    typeErrors.push("Email must be a string");
  }
  if (typeof password !== "string") {
    typeErrors.push("Password must be a string");
  }
  if (typeof username !== "string") {
    typeErrors.push("Username must be a string");
  }
  if (typeof name !== "string") {
    typeErrors.push("Name must be a string");
  }
  
  if (typeErrors.length > 0) {
    return res.status(400).json({
      message: "Validation errors",
      errors: typeErrors
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format"
    });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long"
    });
  }

  // Validate username format
  if (username.length < 3) {
    return res.status(400).json({
      message: "Username must be at least 3 characters long"
    });
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({
      message: "Username can only contain letters, numbers, and underscores"
    });
  }

  next();
};

// Validate login data
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  // Check required fields
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  // Check field types
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      message: "Email and password must be strings"
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format"
    });
  }

  next();
};

// Validate password reset data
export const validatePasswordReset = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  
  // Check required fields
  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      message: "Old password and new password are required"
    });
  }

  // Check field types
  if (typeof oldPassword !== "string" || typeof newPassword !== "string") {
    return res.status(400).json({
      message: "Passwords must be strings"
    });
  }

  // Validate new password strength
  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "New password must be at least 6 characters long"
    });
  }

  next();
};

// Validate profile update data
export const validateProfileUpdate = (req, res, next) => {
  const { name, username, bio } = req.body;
  
  // Check field types if provided
  const typeErrors = [];
  
  if (name !== undefined && typeof name !== "string") {
    typeErrors.push("Name must be a string");
  }
  if (username !== undefined && typeof username !== "string") {
    typeErrors.push("Username must be a string");
  }
  if (bio !== undefined && typeof bio !== "string") {
    typeErrors.push("Bio must be a string");
  }
  
  if (typeErrors.length > 0) {
    return res.status(400).json({
      message: "Validation errors",
      errors: typeErrors
    });
  }

  // Validate username format if provided
  if (username) {
    if (username.length < 3) {
      return res.status(400).json({
        message: "Username must be at least 3 characters long"
      });
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        message: "Username can only contain letters, numbers, and underscores"
      });
    }
  }

  next();
};
