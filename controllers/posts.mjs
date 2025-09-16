import connectionPool from "../utils/db.mjs";

// POST

export const createPost = async (req, res) => {
  try {
    const newPost = req.body;
    const imageUrl = req.imageUrl;

    // validate ขั้นต้น
    if (!newPost.title) {
      return res.status(400).json({ error: "title is required" });
    }
    if (!newPost.category_id) {
      return res.status(400).json({ error: "category_id is required" });
    }
    if (!newPost.status_id) {
      return res.status(400).json({ error: "status_id is required" });
    }
    if (!imageUrl) {
      return res.status(400).json({ error: "image upload failed" });
    }

    const values = [
      newPost.title,
      imageUrl,
      parseInt(newPost.category_id),
      newPost.description || null,
      newPost.content || null,
      parseInt(newPost.status_id),
    ];

    const query = `
      INSERT INTO posts (title, image, category_id, description, content, status_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    await connectionPool.query(query, values);

    return res.status(201).json({ message: "Created post successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server could not create post",
      error: err.message,
    });
  }
};

//GET

// export const readAllPosts = async (req, res) => {
 
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 6;
//     const keyword = req.query.keyword || "";
//     const category = req.query.category || "";

//     const truePage = Math.max(1, page);
//     const truelimit = Math.max(1, Math.min(100, limit));
//     const offset = (truePage - 1) * truelimit;

//     // let query = `
//     //   SELECT posts.id, posts.image, categories.name AS category, posts.title, posts.description, posts.date, posts.content, statuses.status, posts.likes_count
//     //   FROM posts
//     //   INNER JOIN categories ON posts.category_id = categories.id
//     //   INNER JOIN statuses ON posts.status_id = statuses.id
//     // `;

//     let query = `select * from posts`
//     let values = [];

//     if (category && keyword) {
//       query += ` WHERE categories.name ILIKE $1
//         AND (posts.title ILIKE $2 OR posts.content ILIKE $2 OR posts.description ILIKE $2)`;
//       values = [`%${category}%`, `%${keyword}%`];
//     } else if (category) {
//       query += ` WHERE categories.name ILIKE $1`;
//       values = [`%${category}%`];
//     } else if (keyword) {
//       query += ` WHERE (posts.title ILIKE $1 OR posts.content ILIKE $1 OR posts.description ILIKE $1)`;
//       values = [`%${keyword}%`];
//     }

//     query += ` ORDER BY posts.date DESC LIMIT $${values.length + 1} OFFSET $${
//       values.length + 2
//     }`;
//     values.push(truelimit, offset);

//     const result = await connectionPool.query(query, values);

//     //Pagination

//     let countQuery = `SELECT COUNT(*)  
//   FROM posts 
//   INNER JOIN categories ON posts.category_id = categories.id
//   INNER JOIN statuses ON posts.status_id = statuses.id`;
//     let countValues = values.slice(0, -2);

//     if (category && keyword) {
//       countQuery += ` WHERE categories.name ILIKE $1
//     AND (posts.title ILIKE $2 OR posts.content ILIKE $2 OR posts.description ILIKE $2)`;
//     } else if (category) {
//       countQuery += ` WHERE categories.name ILIKE $1`;
//     } else if (keyword) {
//       countQuery += ` WHERE (posts.title ILIKE $1 OR posts.content ILIKE $1 OR posts.description ILIKE $1)`;
//     }

//     const countResult = await connectionPool.query(countQuery, countValues);
//     const totalPosts = parseInt(countResult.rows[0].count, 10);

//     const results = {
//       totalPosts,
//       totalPages: Math.ceil(totalPosts / truelimit),
//       currentPage: truePage,
//       limit: truelimit,
//       posts: result.rows,
//     };

//     if (offset + truelimit < totalPosts) {
//       results.nextPage = truePage + 1;
//     }
//     if (offset > 0) {
//       results.previousPage = truePage - 1;
//     }

//     res.status(200).json(results);
//   } catch (error) {
//     res.status(500).json({
//       message: "Server could not get post because database connection",
//     });
//   }
// };


export const readAllPosts = async (req, res) => {
  try {
    const results = await connectionPool.query(
      `SELECT * 
        FROM posts `
    );
    res.status(200).json(results.rows);
  } catch (error) {
    console.error("readAllPosts error:", error);
    res.status(500).json({
      message: "Server could not get posts due to database connection error",
      error: error.message
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

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const date = new Date();
    const { title, category_id, description, content, status_id } = req.body;
    const imageUrl = req.imageUrl;
    
    const existingPost = await connectionPool.query(
      `SELECT * FROM posts WHERE id = $1`,
      [postId]
    );

    if (existingPost.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    const results = await connectionPool.query(
      `UPDATE posts  
       SET title = $2,
           image = $3,
           category_id = $4,
           description = $5,
           content = $6,
           status_id = $7,
           date = $8
       WHERE id = $1
       RETURNING *`,
      [
        postId,
        title,
        imageUrl,
        category_id,
        description,
        content,
        status_id,
        date,
      ]
    );

    res.status(200).json({
      message: "Updated post successfully",
      post: results.rows[0],
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({
      message: "Server could not update post",
      error: error.message
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
