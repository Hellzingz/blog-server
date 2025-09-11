import connectionPool from "../utils/db.mjs";

export const create = async (req, res) => {
  const { title, image, category_id, description, content, status_id } =
    req.body;
  try {
    const query = await connectionPool.query(
      `insert into posts (title, image, category_id, description, content, status_id)
        values($1, $2, $3, $4, $5, $6)`,
      [title, image, category_id, description, content, status_id]
    );
    res.status(201).json({ message: "Created post sucessfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
};

export const read = async (req, res) => {
  try {
    const results = await connectionPool.query(`select * from posts`);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({
      message: "Server could not get post because database connection",
    });
  }
};
