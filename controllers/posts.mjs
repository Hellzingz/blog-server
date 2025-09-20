import { createClient } from "@supabase/supabase-js";

// ตรวจสอบ environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error("Error: Supabase environment variables are not set");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title: newPost.title,
          image: imageUrl,
          category_id: parseInt(newPost.category_id),
          description: newPost.description || null,
          content: newPost.content || null,
          status_id: parseInt(newPost.status_id),
        },
      ])
      .select("id");

    if (error) {
      console.error("Create post error:", error);
      return res.status(500).json({
        message: "Server could not create post",
        error: error.message,
      });
    }

    return res.status(201).json({
      message: "Created post successfully",
      postId: data[0].id,
    });
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";

    const truePage = Math.max(1, page);
    const truelimit = Math.max(1, Math.min(100, limit));
    const offset = (truePage - 1) * truelimit;

    // Base query
    let query = supabase
      .from("posts")
      .select(
        `
        id, image, title, description, date, content, likes_count,
        categories!inner(id, name),
        statuses(status)
      `,
        { count: "exact" }
      )
      .order("date", { ascending: false })
      .range(offset, offset + truelimit - 1);

    // Filter by category
    if (category) {
      query = query.ilike("categories.name", `%${category}%`);
    }

    // Filter by keyword (title, content, description)
    if (keyword) {
      query = query.or(
        `title.ilike.%${keyword}%,content.ilike.%${keyword}%,description.ilike.%${keyword}%`
      );
    }

    const { data: posts, count: totalPosts, error } = await query;

    if (error) {
      throw error;
    }

    // แปลงข้อมูลให้ตรงกับ format เดิม
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      image: post.image,
      category: post.categories.name,
      description: post.description,
      date: post.date,
      content: post.content,
      status: post.statuses.status,
      likes_count: post.likes_count,
    }));

    const results = {
      totalPosts,
      totalPages: Math.ceil(totalPosts / truelimit),
      currentPage: truePage,
      limit: truelimit,
      posts: formattedPosts,
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
      message: "Server could not get posts because of Supabase error",
      error: error.message,
    });
  }
};

export const readById = async (req, res) => {
  const { postId } = req.params;

  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        title,
        image,
        description,
        date,
        content,
        likes_count,
        categories!inner(name),
        statuses!inner(status)
      `
      )
      .eq("id", postId)
      .single();

    if (error) {
      console.error("readById error:", error);
      return res.status(500).json({
        message: "Server could not get post because database connection",
        error: error.message,
      });
    }

    // แปลงข้อมูลให้ตรงกับ format เดิม
    const formattedData = {
      id: data.id,
      title: data.title,
      image: data.image,
      category: data.categories.name,
      description: data.description,
      date: data.date,
      content: data.content,
      status: data.statuses.status,
      likes_count: data.likes_count,
    };

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("readById error:", error);
    res.status(500).json({
      message: "Server could not get post because database connection",
      error: error.message,
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

    // ตรวจสอบว่า post มีอยู่หรือไม่
    const { data: existingPost, error: checkError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", postId)
      .single();

    if (checkError || !existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // อัปเดต post
    const { data, error } = await supabase
      .from("posts")
      .update({
        title: title,
        image: imageUrl,
        category_id: category_id,
        description: description,
        content: content,
        status_id: status_id,
        date: date,
      })
      .eq("id", postId)
      .select()
      .single();

    if (error) {
      console.error("Update post error:", error);
      return res.status(500).json({
        message: "Server could not update post",
        error: error.message,
      });
    }

    res.status(200).json({
      message: "Updated post successfully",
      post: data,
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({
      message: "Server could not update post",
      error: error.message,
    });
  }
};

//DELETE

export const deleteById = async (req, res) => {
  const { postId } = req.params;
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.error("Delete post error:", error);
      return res.status(500).json({
        message: "Server could not delete post because database connection",
        error: error.message,
      });
    }

    res.status(200).json({ message: "Deleted post successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      message: "Server could not delete post because database connection",
      error: error.message,
    });
  }
};
