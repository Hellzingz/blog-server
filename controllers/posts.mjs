import connectionPool from "../utils/db.mjs";

// POST

export const create = async (req, res) => {
  const { title, image, category_id, description, content, status_id } =
    req.body;
  try {
    const query = await connectionPool.query(
      `INSERT INTO posts (title, image, category_id, description, content, status_id)
        VALUES($1, $2, $3, $4, $5, $6)`,
      [title, image, category_id, description, content, status_id]
    );
    res.status(201).json({ message: "Created post sucessfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
};

//GET

export const read = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";

    const truePage = Math.max(1, page);
    const truelimit = Math.max(1, Math.min(100, limit));
    const offset = (truePage - 1) * truelimit;

    let query = `
      SELECT posts.id, posts.image, categories.name AS category, posts.title, posts.description, posts.date, posts.content, statuses.status, posts.likes_count
      FROM posts
      INNER JOIN categories ON posts.category_id = categories.id
      INNER JOIN statuses ON posts.status_id = statuses.id
    `;
    let values = [];

    if (category && keyword) {
      query += ` WHERE categories.name ILIKE $1
        AND (posts.title ILIKE $2 OR posts.content ILIKE $2 OR posts.description ILIKE $2)`;
      values = [`%${category}%`, `%${keyword}%`];
    } else if (category) {
      query += ` WHERE categories.name ILIKE $1`;
      values = [`%${category}%`];
    } else if (keyword) {
      query += ` WHERE (posts.title ILIKE $1 OR posts.content ILIKE $1 OR posts.description ILIKE $1)`;
      values = [`%${keyword}%`];
    }

    query += ` ORDER BY posts.date DESC LIMIT $${values.length + 1} OFFSET $${
      values.length + 2
    }`;
    values.push(truelimit, offset);

    const result = await connectionPool.query(query, values);

    //Pagination

    let countQuery = `SELECT COUNT(*)  
  FROM posts 
  INNER JOIN categories ON posts.category_id = categories.id
  INNER JOIN statuses ON posts.status_id = statuses.id`;
    let countValues = values.slice(0, -2);

    if (category && keyword) {
      countQuery += ` WHERE categories.name ILIKE $1
    AND (posts.title ILIKE $2 OR posts.content ILIKE $2 OR posts.description ILIKE $2)`;
    } else if (category) {
      countQuery += ` WHERE categories.name ILIKE $1`;
    } else if (keyword) {
      countQuery += ` WHERE (posts.title ILIKE $1 OR posts.content ILIKE $1 OR posts.description ILIKE $1)`;
    }

    const countResult = await connectionPool.query(countQuery, countValues);
    const totalPosts = parseInt(countResult.rows[0].count, 10);

    const results = {
      totalPosts,
      totalPages: Math.ceil(totalPosts / truelimit),
      currentPage: truePage,
      limit: truelimit,
      posts: result.rows,
    };

    if (offset + truelimit < totalPosts) {
      results.nextPage = truePage + 1;
    }
    if (offset > 0) {
      results.previousPage = truePage - 1;
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: "Server could not get post because database connection",
    });
  }
};

export const readById = async (req, res) => {
  const { postId } = req.params;
  try {
    const results = await connectionPool.query(
      `SELECT posts.id, posts.title, posts.image, categories.name AS category, posts.description, posts.date, posts.content, statuses.status AS status, posts.likes_count 
        FROM posts 
        INNER JOIN categories ON posts.category_id = categories.id
        INNER JOIN statuses ON posts.status_id = statuses.id
        WHERE posts.id = $1`,
      [postId]
    );
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Server could not get post because database connection",
    });
  }
};

//PUT

export const update = async (req, res) => {
  const { postId } = req.params;
  const { date } = new Date();
  const { title, image, category_id, description, content, status_id } =
    req.body;

  try {
    const results = await connectionPool.query(
      `UPDATE posts  
      SET title = $2,
      image = $3,
      category_id = $4,
      description = $5,
      content = $6,
      status_id = $7,
      date = $8
      WHERE id = $1`,
      [postId, title, image, category_id, description, content, status_id, date]
    );
    res.status(200).json({ message: "Updated post sucessfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server could not update post because database connection",
    });
  }
};

//DELETE

export const deleteById = async (req, res) => {
  const { postId } = req.params;
  try {
    const results = await connectionPool.query(
      `DELETE FROM posts
      WHERE posts.id = $1`,
      [postId]
    );
    res.status(200).json({ message: "Deleted post sucessfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server could not get post because database connection",
    });
  }
};
