import * as CategoriesRepository from "../repositories/categoriesRepository.mjs";

// GET All Categories
export async function getAllCategories() {
  try {
    const { data, error } = await CategoriesRepository.getAllCategories();

    if (error) {
      throw new Error("Server could not get categories");
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// GET Category by ID
export async function getCategoryById(categoryId) {
  try {
    const { data, error } = await CategoriesRepository.getCategoryById(
      categoryId
    );

    if (error) {
      throw new Error("Server could not get category");
    }

    if (!data) {
      throw new Error("Category not found");
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// CREATE Category
export async function createCategory(name) {
  try {
    if (!name) {
      throw new Error("Name is required");
    }

    const { data: existingCategory, error: checkError } =
      await CategoriesRepository.checkCategoryNameExists(name);

    if (existingCategory) {
      throw new Error("Category name already exists");
    }

    const { data, error } = await CategoriesRepository.createCategory(name);

    if (error) {
      throw new Error("Server could not create category");
    }

    return {
      success: true,
      message: "Created category successfully",
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// UPDATE Category
export async function updateCategory(categoryId, name) {
  try {
    if (!name) {
      throw new Error("Name is required");
    }

    const { data: existingCategory, error: checkError } =
      await CategoriesRepository.getCategoryById(categoryId);

    if (checkError || !existingCategory) {
      throw new Error("Category not found");
    }

    const { data: duplicateCheck, error: duplicateError } =
      await CategoriesRepository.checkCategoryNameExistsExcludingId(
        name,
        categoryId
      );

    if (duplicateCheck) {
      throw new Error("Category name already exists");
    }

    const { data, error } = await CategoriesRepository.updateCategory(
      categoryId,
      name
    );

    if (error) {
      throw new Error("Server could not update category");
    }

    return {
      success: true,
      message: "Updated category successfully",
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// DELETE Category
export async function deleteCategory(categoryId) {
  try {
    const { error } = await CategoriesRepository.deleteCategory(categoryId);

    if (error) {
      throw new Error("Server could not delete category");
    }

    return {
      success: true,
      message: "Deleted category successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
