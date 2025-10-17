import { CategoriesRepository } from '../repositories/categoriesRepository.mjs';

export class CategoriesService {
  // ดึงหมวดหมู่ทั้งหมด
  static async getAllCategories() {
    try {
      const { data, error } = await CategoriesRepository.getAllCategories();
      
      if (error) {
        throw new Error("Server could not get categories");
      }
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ดึงหมวดหมู่ตาม ID
  static async getCategoryById(categoryId) {
    try {
      const { data, error } = await CategoriesRepository.getCategoryById(categoryId);
      
      if (error) {
        throw new Error("Server could not get category");
      }

      if (!data) {
        throw new Error("Category not found");
      }
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // สร้างหมวดหมู่ใหม่
  static async createCategory(name) {
    try {
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!name) {
        throw new Error("Name is required");
      }

      // ตรวจสอบว่าชื่อซ้ำหรือไม่
      const { data: existingCategory, error: checkError } = await CategoriesRepository.checkCategoryNameExists(name);
      
      if (existingCategory) {
        throw new Error("Category name already exists");
      }

      // สร้างหมวดหมู่ใหม่
      const { data, error } = await CategoriesRepository.createCategory(name);
      
      if (error) {
        throw new Error("Server could not create category");
      }

      return {
        success: true,
        message: "Created category successfully",
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // อัปเดตหมวดหมู่
  static async updateCategory(categoryId, name) {
    try {
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!name) {
        throw new Error("Name is required");
      }

      // ตรวจสอบว่ามี ID ที่จะอัพเดทหรือไม่
      const { data: existingCategory, error: checkError } = await CategoriesRepository.getCategoryById(categoryId);
      
      if (checkError || !existingCategory) {
        throw new Error("Category not found");
      }

      // ตรวจสอบชื่อซ้ำ
      const { data: duplicateCheck, error: duplicateError } = await CategoriesRepository.checkCategoryNameExistsExcludingId(name, categoryId);
      
      if (duplicateCheck) {
        throw new Error("Category name already exists");
      }

      // อัปเดตหมวดหมู่
      const { data, error } = await CategoriesRepository.updateCategory(categoryId, name);
      
      if (error) {
        throw new Error("Server could not update category");
      }

      return {
        success: true,
        message: "Updated category successfully",
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ลบหมวดหมู่
  static async deleteCategory(categoryId) {
    try {
      const { error } = await CategoriesRepository.deleteCategory(categoryId);
      
      if (error) {
        throw new Error("Server could not delete category");
      }

      return {
        success: true,
        message: "Deleted category successfully"
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
