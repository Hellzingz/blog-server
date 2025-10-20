import { validateRequired, validateTypes } from './validation.mjs';

// Validate post creation/update data
export const validatePost = (req, res, next) => {
  const formData = req.body;
  
  // Check required fields
  const requiredFields = ['title', 'category_id', 'description', 'content', 'status_id'];
  const missingFields = requiredFields.filter(field => !formData[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: `Required fields missing: ${missingFields.join(', ')}`,
      missingFields 
    });
  }

  // Check field types
  const typeErrors = [];
  
  if (typeof formData.title !== "string") {
    typeErrors.push("Title must be a string");
  }
  if (isNaN(Number(formData.category_id))) {
    typeErrors.push("Category ID must be a number");
  }
  if (typeof formData.description !== "string") {
    typeErrors.push("Description must be a string");
  }
  if (typeof formData.content !== "string") {
    typeErrors.push("Content must be a string");
  }
  if (isNaN(Number(formData.status_id))) {
    typeErrors.push("Status ID must be a number");
  }
  
  if (typeErrors.length > 0) {
    return res.status(400).json({ 
      message: "Validation errors",
      errors: typeErrors 
    });
  }
  
  next();
};
