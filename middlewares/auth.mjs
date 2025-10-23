import { validateRequired, validateTypes, validatePassword, validateUsername } from './validation.mjs';

// Validate registration data
export const validateRegistration = (req, res, next) => {
  const { email, password, username, name } = req.body;
  
  // Normalize email to lowercase
  if (email) {
    req.body.email = email.toLowerCase().trim();
  }
  const requiredFields = ['email', 'password', 'username', 'name'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Required fields missing: ${missingFields.join(', ')}`,
      missingFields
    });
  }
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format"
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters"
    });
  }
  if (password.length > 20) {
    return res.status(400).json({
      message: "Password must be no more than 20 characters"
    });
  }
  if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password)) {
    return res.status(400).json({
      message: "Password must contain at least one letter and one number"
    });
  }
  if (username.length < 4) {
    return res.status(400).json({
      message: "Username must be at least 4 characters"
    });
  }
  if (username.length > 15) {
    return res.status(400).json({
      message: "Username must be no more than 15 characters"
    });
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return res.status(400).json({
      message: "Username must contain only letters and numbers"
    });
  }

  // Name validation
  if (name.length < 4) {
    return res.status(400).json({
      message: "Name must be at least 4 characters"
    });
  }
  if (name.length > 20) {
    return res.status(400).json({
      message: "Name must be no more than 20 characters"
    });
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return res.status(400).json({
      message: "Name must contain only English letters and spaces"
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  // Normalize email to lowercase
  if (email) {
    req.body.email = email.toLowerCase().trim();
  }
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      message: "Email and password must be strings"
    });
  }
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
  
  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      message: "Old password and new password are required"
    });
  }
  if (typeof oldPassword !== "string" || typeof newPassword !== "string") {
    return res.status(400).json({
      message: "Passwords must be strings"
    });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({
      message: "New password must be at least 8 characters"
    });
  }
  if (newPassword.length > 20) {
    return res.status(400).json({
      message: "New password must be no more than 20 characters"
    });
  }
  if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(newPassword)) {
    return res.status(400).json({
      message: "New password must contain at least one letter and one number"
    });
  }

  next();
};

// Validate profile update data
export const validateAdminUpdate = (req, res, next) => {
  const { name, username, bio } = req.body;
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
  if (username) {
    if (username.length < 4) {
      return res.status(400).json({
        message: "Username must be at least 4 characters"
      });
    }
    if (username.length > 15) {
      return res.status(400).json({
        message: "Username must be no more than 15 characters"
      });
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res.status(400).json({
        message: "Username must contain only letters and numbers"
      });
    }
  }

  if (name) {
    if (name.length < 4) {
      return res.status(400).json({
        message: "Name must be at least 4 characters"
      });
    }
    if (name.length > 20) {
      return res.status(400).json({
        message: "Name must be no more than 20 characters"
      });
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return res.status(400).json({
        message: "Name must contain only English letters and spaces"
      });
    }
  }

  next();
};
// Validate user profile update data
export const validateUserProfileUpdate = (req, res, next) => {
  const { name, username } = req.body;
  const typeErrors = [];
  
  if (name !== undefined && typeof name !== "string") {
    typeErrors.push("Name must be a string");
  }
  if (username !== undefined && typeof username !== "string") {
    typeErrors.push("Username must be a string");
  }
  
  if (typeErrors.length > 0) {
    return res.status(400).json({
      message: "Validation errors",
      errors: typeErrors
    });
  }
  
  if (username) {
    if (username.length < 4) {
      return res.status(400).json({
        message: "Username must be at least 4 characters"
      });
    }
    if (username.length > 15) {
      return res.status(400).json({
        message: "Username must be no more than 15 characters"
      });
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res.status(400).json({
        message: "Username must contain only letters and numbers"
      });
    }
  }

  if (name) {
    if (name.length < 4) {
      return res.status(400).json({
        message: "Name must be at least 4 characters"
      });
    }
    if (name.length > 20) {
      return res.status(400).json({
        message: "Name must be no more than 20 characters"
      });
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return res.status(400).json({
        message: "Name must contain only English letters and spaces"
      });
    }
  }

  next();
};