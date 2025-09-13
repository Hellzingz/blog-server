import connectionPool from "../utils/db.mjs";

//GET

//READALL
export const readCategory = async (req, res) => {
  try {
    const results = await connectionPool.query(`select * from categories`);
   
    res.status(200).json(results.rows);
   
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server could not delete category",
      error: err.message,
    });
  }
};

//READBYID
export const readByIdCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const results = await connectionPool.query(`select * from categories where id = $1`,[categoryId]);
   
    res.status(200).json(results.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server could not delete category",
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
    const existingCategory = await connectionPool.query(
      `SELECT * FROM categories WHERE name = $1`,
      [name]
    );

    if (existingCategory.rows.length > 0) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    await connectionPool.query(
      `INSERT INTO categories (name)
        VALUES ($1)`,
      [name]
    );

    return res.status(201).json({ message: "Created category successfully" });
  } catch (err) {
    console.error(err);
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

    // ครวจสอบว่ามี ID ที่จะอัพเดทไหมไหม
    const existingCategory = await connectionPool.query(
      `SELECT * FROM categories WHERE id = $1`,
      [categoryId]
    );

    if (existingCategory.rows.length === 0) {
      return res.status(400).json({ error: "Category not found" });
    }
    // ตรวจสอบชื่อซ้ำ
    const duplicateCheck = await connectionPool.query(
      `SELECT * FROM categories WHERE name = $1`,
      [name]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    const { rows } = await connectionPool.query(
      `UPDATE categories
         SET name = $2
         WHERE id = $1
         RETURNING *`,
      [categoryId, name]
    );

    return res.status(200).json({
      message: "Updated category successfully",
      category: rows[0],
    });
  } catch (err) {
    console.error(err);
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

    await connectionPool.query(
      `delete from categories 
          WHERE id = $1`,
      [categoryId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ message: "Deleted category successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server could not delete category",
      error: err.message,
    });
  }
};
