import { PostsService } from '../services/postsService.mjs';

// POST

//Comments
export const createComment = async (req, res) => {
  try {
    const { post_id, user_id, comment_text } = req.body;
    const result = await PostsService.createComment(post_id, user_id, comment_text);
    
    if (result.success) {
      res.status(201).json({
        message: result.message,
      });
    } else {
      res.status(400).json({
        message: "Server could not create comment",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Controller crashed:", error);
    res.status(500).json({
      message: "Server could not create comment",
      error: error.message,
    });
  }
};

//Likes
export const handleLikes = async (req, res) => {
  try {
    const { user_id } = req.body;
    const post_id = Number(req.params.postId);
    const result = await PostsService.handleLikes(user_id, post_id);
    
    if (result.success) {
      res.json({ status: result.status });
    } else {
      res.status(500).json({
        message: "Server Error",
        error: result.error,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
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
    const result = await PostsService.createPost(newPost, imageUrl);
    
    if (result.success) {
      res.status(201).json({
        message: result.message,
        postId: result.postId,
      });
    } else {
      const statusCode = result.error.includes("required") || result.error.includes("upload failed") ? 400 : 500;
      res.status(statusCode).json({
        message: "Server could not create post",
        error: result.error,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server could not create post",
      error: err.message,
    });
  }
};

//GET Post

export const readAllPosts = async (req, res) => {
  try {
    const result = await PostsService.getAllPosts(req.query);
    
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({
        message: "Server could not get posts because of Supabase error",
        error: result.error,
      });
    }
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
    const result = await PostsService.getPostById(postId);
    
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({
        message: "Server could not get post because database connection",
        error: result.error,
      });
    }
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
    const post_id = Number(req.params.postId);
    const result = await PostsService.getComments(post_id, req.query);
    
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({
        message: "Server could not get posts because of Supabase error",
        error: result.error,
      });
    }
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
    const { title, category_id, description, content, status_id } = req.body;
    const imageUrl = req.imageUrl;
    const result = await PostsService.updatePost(postId, {
      title, category_id, description, content, status_id
    }, imageUrl);
    
    if (result.success) {
      res.status(200).json({
        message: result.message,
        post: result.data,
      });
    } else {
      const statusCode = result.error.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        message: "Server could not update post",
        error: result.error,
      });
    }
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
    const result = await PostsService.deletePost(postId);
    
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(500).json({
        message: "Server could not delete post because database connection",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      message: "Server could not delete post because database connection",
      error: error.message,
    });
  }
};
