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

//Comments
export const createComment = async (req, res) => {
  try {
    const { post_id, user_id, comment_text } = req.body;

    const { error } = await supabase.from("comments").insert([
      {
        post_id: parseInt(post_id, 10),
        user_id,
        comment_text,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(400).json({
        message: "Supabase insert failed",
        error: error.message,
      });
    }

    return res.status(201).json({
      message: "Created comment successfully",
    });
  } catch (error) {
    console.error("Controller crashed:", error);
    return res.status(500).json({
      message: "Server could not create comment",
      error: error.message,
    });
  }
};

//Likes
export const handleLikes = async (req, res) => {
  try {
    const { post_id, user_id } = req.body;

    const { data: existing, error: checkError } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", user_id)
      .eq("post_id", post_id)
      .maybeSingle();

    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("likes_count")
      .eq("id", post_id)
      .single();

    if (postError) throw postError;

    if (existing) {
      await supabase.from("likes").delete().eq("id", existing.id);

      await supabase
        .from("posts")
        .update({ likes_count: Math.max(post.likes_count - 1, 0) })
        .eq("id", post_id);

      return res.json({ status: "unliked" });
    } else {
      await supabase.from("likes").insert({ user_id, post_id });

      await supabase
        .from("posts")
        .update({ likes_count: post.likes_count + 1 })
        .eq("id", post_id);

      return res.json({ status: "liked" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Posts
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

//GET Post

export const readAllPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";
    const status = Number(req.query.status) || "";

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
        statuses(id, status)
      `,
        { count: "exact" }
      )
      .order("date", { ascending: false })
      .range(offset, offset + truelimit - 1);

    // Filter by category
    if (category) {
      query = query.ilike("categories.name", `%${category}%`);
    }

    //Filter by status
    if (status) {
      query = query.eq("status_id", status);
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

//GET Comments

export const readComments = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const post_id = Number(req.params.postId);

    const truePage = Math.max(1, page);
    const truelimit = Math.max(1, Math.min(100, limit));
    const offset = (truePage - 1) * truelimit;

    // Base query
    let query = supabase
      .from("comments")
      .select(
        `
        id,
        post_id,
        comment_text,
        created_at,
        users!inner(name, profile_pic)
      `,
        { count: "exact" }
      )
      .eq("post_id", post_id)
      .order("created_at", { ascending: false })
      .range(offset, offset + truelimit - 1);

    const { data: comments, count: totalComments, error } = await query;

    if (error) {
      throw error;
    }

    // แปลงข้อมูลให้ตรงกับ format เดิม
    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      comment: comment.comment_text,
      date: comment.created_at,
      name: comment.users.name,
      pic: comment.users.profile_pic,
    }));

    const results = {
      totalComments,
      totalPages: Math.ceil(totalComments / truelimit),
      currentPage: truePage,
      limit: truelimit,
      comments: formattedComments,
    };

    if (offset + truelimit < totalComments) {
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

//GET Likes

export const countLikes = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const post_id = Number(req.params.postId);

    const truePage = Math.max(1, page);
    const truelimit = Math.max(1, Math.min(100, limit));
    const offset = (truePage - 1) * truelimit;

    // Base query
    let query = supabase
      .from("comments")
      .select(
        `
        id,
        post_id,
        comment_text,
        created_at,
        users!inner(name, profile_pic)
      `,
        { count: "exact" }
      )
      .eq("post_id", post_id)
      .order("created_at", { ascending: false })
      .range(offset, offset + truelimit - 1);

    const { data: comments, count: totalComments, error } = await query;

    if (error) {
      throw error;
    }

    // แปลงข้อมูลให้ตรงกับ format เดิม
    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      comment: comment.comment_text,
      date: comment.created_at,
      name: comment.users.name,
      pic: comment.users.profile_pic,
    }));

    const results = {
      totalComments,
      totalPages: Math.ceil(totalComments / truelimit),
      currentPage: truePage,
      limit: truelimit,
      comments: formattedComments,
    };

    if (offset + truelimit < totalComments) {
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
