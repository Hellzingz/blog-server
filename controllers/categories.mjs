import { createClient } from "@supabase/supabase-js";

// ตรวจสอบ environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('Error: Supabase environment variables are not set');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

//GET

//READALL
export const readCategory = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error("readCategory error:", error);
      return res.status(500).json({
        message: "Server could not get categories",
        error: error.message,
      });
    }
   
    res.status(200).json(data);
   
  } catch (err) {
    console.error("readCategory error:", err);
    return res.status(500).json({
      message: "Server could not get categories",
      error: err.message,
    });
  }
};

//READBYID
export const readByIdCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) {
      console.error("readByIdCategory error:", error);
      return res.status(500).json({
        message: "Server could not get category",
        error: error.message,
      });
    }

    if (!data) {
      return res.status(404).json({ error: "Category not found" });
    }
   
    res.status(200).json(data);
  } catch (err) {
    console.error("readByIdCategory error:", err);
    return res.status(500).json({
      message: "Server could not get category",
      error: err.message,
    });
  }
};

//POST
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // validate ขั้นต้น
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // ตรวจสอบว่าชื่อซ้ำหรือไม่
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', name)
      .single();

    if (existingCategory) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: name }])
      .select()
      .single();

    if (error) {
      console.error("createCategory error:", error);
      return res.status(500).json({
        message: "Server could not create category",
        error: error.message,
      });
    }

    return res.status(201).json({ 
      message: "Created category successfully",
      category: data 
    });
  } catch (err) {
    console.error("createCategory error:", err);
    return res.status(500).json({
      message: "Server could not create category",
      error: err.message,
    });
  }
};

//PUT
export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    // validate ขั้นต้น
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // ตรวจสอบว่ามี ID ที่จะอัพเดทหรือไม่
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', categoryId)
      .single();

    if (checkError || !existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // ตรวจสอบชื่อซ้ำ
    const { data: duplicateCheck, error: duplicateError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', name)
      .neq('id', categoryId)
      .single();

    if (duplicateCheck) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    const { data, error } = await supabase
      .from('categories')
      .update({ name: name })
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      console.error("updateCategory error:", error);
      return res.status(500).json({
        message: "Server could not update category",
        error: error.message,
      });
    }

    return res.status(200).json({
      message: "Updated category successfully",
      category: data,
    });
  } catch (err) {
    console.error("updateCategory error:", err);
    return res.status(500).json({
      message: "Server could not update category",
      error: err.message,
    });
  }
};

//DELETE
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error("deleteCategory error:", error);
      return res.status(500).json({
        message: "Server could not delete category",
        error: error.message,
      });
    }

    return res.status(200).json({ message: "Deleted category successfully" });
  } catch (err) {
    console.error("deleteCategory error:", err);
    return res.status(500).json({
      message: "Server could not delete category",
      error: err.message,
    });
  }
};
