import * as CategoriesService from '../services/categoriesService.mjs';

//GET

// GET All Categories
export const readCategory = async (req, res) => {
  try {
    const result = await CategoriesService.getAllCategories();
    
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({
        message: "Server could not get categories",
        error: result.error,
      });
    }
  } catch (err) {
    console.error("readCategory error:", err);
    res.status(500).json({
      message: "Server could not get categories",
      error: err.message,
    });
  }
};

// GET Category by ID
export const readByIdCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const result = await CategoriesService.getCategoryById(categoryId);
    
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      const statusCode = result.error.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        message: "Server could not get category",
        error: result.error,
      });
    }
  } catch (err) {
    console.error("readByIdCategory error:", err);
    res.status(500).json({
      message: "Server could not get category",
      error: err.message,
    });
  }
};

// CREATE Category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await CategoriesService.createCategory(name);
    
    if (result.success) {
      res.status(201).json({ 
        message: result.message,
        category: result.data 
      });
    } else {
      const statusCode = result.error.includes("required") || result.error.includes("already exists") ? 400 : 500;
      res.status(statusCode).json({
        message: "Server could not create category",
        error: result.error,
      });
    }
  } catch (err) {
    console.error("createCategory error:", err);
    res.status(500).json({
      message: "Server could not create category",
      error: err.message,
    });
  }
};

// UPDATE Category
export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    const result = await CategoriesService.updateCategory(categoryId, name);
    
    if (result.success) {
      res.status(200).json({
        message: result.message,
        category: result.data,
      });
    } else {
      const statusCode = result.error.includes("required") || result.error.includes("already exists") ? 400 : 
                        result.error.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        message: "Server could not update category",
        error: result.error,
      });
    }
  } catch (err) {
    console.error("updateCategory error:", err);
    res.status(500).json({
      message: "Server could not update category",
      error: err.message,
    });
  }
};

// DELETE Category
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const result = await CategoriesService.deleteCategory(categoryId);
    
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(500).json({
        message: "Server could not delete category",
        error: result.error,
      });
    }
  } catch (err) {
    console.error("deleteCategory error:", err);
    res.status(500).json({
      message: "Server could not delete category",
      error: err.message,
    });
  }
};
