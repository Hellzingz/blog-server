import * as PostsService from "../services/postsService.mjs";

// POST Comment
export const createComment = async (req, res) => {
  try {
    const { post_id, user_id, comment_text,post_title } = req.body;
    const result = await PostsService.createComment(
      post_id,
      user_id,
      comment_text,
      post_title
    );

    if (result.success) {
      res.status(201).json({
        message: result.message,
      });
    } else {
      res.status(400).json({
        message: result.error,
      });
    }
  } catch (error) {
    console.error("Controller crashed:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// HANDLE Likes
export const handleLikes = async (req, res) => {
  try {
    const { user_id, post_title } = req.body;
    const post_id = Number(req.params.postId);
    const result = await PostsService.handleLikes(user_id, post_id, post_title);

    if (result.success) {
      res.json({ status: result.status });
    } else {
      res.status(500).json({
      message: result.error,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE Post
export const createPost = async (req, res) => {
  try {
    const newPost = req.body;
    const imageUrl = req.imageUrl
    const result = await PostsService.createPost(newPost, imageUrl);

    res.status(201).json({
      message: "Created post successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

//GET All Posts
export const readAllPosts = async (req, res) => {
  try {
    const result = await PostsService.getAllPosts(req.query);

    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({
        message: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET Post by ID
export const readById = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await PostsService.getPostById(postId);

    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({
        message: result.error,
      });
    }
  } catch (error) {
    console.error("readById error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

//GET Post Titles
export const getPostTitles = async (req, res) => {
  const { status,keyword } = req.query;
  try {
    const result = await PostsService.getPostTitles(status,keyword);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({
        message: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//GET Comments
export const readComments = async (req, res) => {
  try {
    const post_id = Number(req.params.postId);
    const result = await PostsService.getComments(post_id, req.query);

    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({
        message: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE Post
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, category_id, description, content, status_id } = req.body;
    const imageUrl = req.imageUrl;
    const result = await PostsService.updatePost(
      postId,
      {
        title,
        category_id,
        description,
        content,
        status_id,
      },
      imageUrl
    );

    if (result.success) {
      res.status(200).json({
        message: result.message,
        post: result.data,
      });
    } else {
      const statusCode = result.error.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        message: result.error,
      });
    }
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE Post
export const deleteById = async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await PostsService.deletePost(postId);

    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(500).json({
        message: result.error,
      });
    }
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
