import * as PostsRepository from "../repositories/postsRepository.mjs";
import * as NotificationService from "./notification.mjs";
import * as AuthRepository from "../repositories/authRepository.mjs";

// CREATE Post
export async function createPost(postData, imageUrl, user_id) {
  try {
    if (!postData.title) {
      throw new Error("title is required");
    }
    if (!postData.category_id) {
      throw new Error("category_id is required");
    }
    if (!postData.status_id) {
      throw new Error("status_id is required");
    }
    if (!imageUrl) {
      throw new Error("image upload failed");
    }

    const newPost = {
      title: postData.title,
      image: imageUrl,
      category_id: parseInt(postData.category_id),
      description: postData.description || null,
      content: postData.content || null,
      status_id: parseInt(postData.status_id),
      user_id: user_id, // เพิ่ม user_id
    };

    const { data, error } = await PostsRepository.createPost(newPost);

    if (error) {
      throw new Error("Server could not create post");
    }

    return {
      success: true,
      message: "Created post successfully",
      postId: data[0].id,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// GET All Posts
export async function getAllPosts(queryParams) {
  try {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 6;
    const searchId = Number(queryParams.searchId) || "";
    const keyword = queryParams.keyword || "";
    const category = Number(queryParams.category) || "";
    const status = Number(queryParams.status) || "";

    const {
      data: posts,
      count: totalPosts,
      error,
      truePage,
      truelimit,
    } = await PostsRepository.getAllPosts({
      page,
      limit,
      searchId,
      keyword,
      category,
      status,
    });

    if (error) {
      throw error;
    }

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      image: post.image,
      category: post.categories.name,
      description: post.description,
      date: post.date,
      content: post.content,
      user: {
        id: post.users.id,
        name: post.users.name,
        profile_pic: post.users.profile_pic,
      },
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

    if (truePage * truelimit < totalPosts) {
      results.nextPage = truePage + 1;
    }
    if (truePage > 1) {
      results.previousPage = truePage - 1;
    }

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// GET Post by ID
export async function getPostById(postId) {
  try {
    const { data, error } = await PostsRepository.getPostById(postId);

    if (error) {
      throw new Error("Server could not get post because database connection");
    }

    // ตรวจสอบว่ามีข้อมูลครบถ้วน
    if (!data || !data.categories || !data.statuses || !data.users) {
      throw new Error("Post data is incomplete");
    }

    const formattedData = {
      id: data.id,
      title: data.title,
      image: data.image,
      category: data.categories.name,
      description: data.description,
      user: {
        id: data.users.id,
        name: data.users.name,
        profile_pic: data.users.profile_pic,
      },
      date: data.date,
      content: data.content,
      status: data.statuses.status,
      likes_count: data.likes_count,
    };

    return {
      success: true,
      data: formattedData,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// UPDATE Post
export async function updatePost(postId, updateData, imageUrl) {
  try {
    const date = new Date();
    const { title, category_id, description, content, status_id } = updateData;

    const { data: existingPost, error: checkError } =
      await PostsRepository.checkPostExists(postId);

    if (checkError || !existingPost) {
      throw new Error("Post not found");
    }

    const { data, error } = await PostsRepository.updatePost(postId, {
      title: title,
      image: imageUrl,
      category_id: category_id,
      description: description,
      content: content,
      status_id: status_id,
      date: date,
    });

    if (error) {
      throw new Error("Server could not update post");
    }

    return {
      success: true,
      message: "Updated post successfully",
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// DELETE Post
export async function deletePost(postId) {
  try {
    const { error } = await PostsRepository.deletePost(postId);

    if (error) {
      throw new Error(
        "Server could not delete post because database connection"
      );
    }

    return {
      success: true,
      message: "Deleted post successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// POST Comment
export async function createComment(postId, userId, commentText) {
  try {
    const commentData = {
      post_id: parseInt(postId, 10),
      user_id: userId,
      comment_text: commentText,
    };

    const { error } = await PostsRepository.createComment(commentData);

    if (error) {
      throw new Error("Supabase insert failed");
    }

    // สร้าง notification สำหรับ comment
    try {
      // ดึงข้อมูล post เพื่อหา owner
      const { data: post, error: postError } = await PostsRepository.getPostForLike(postId);
      
      if (!postError && post && post.user_id !== userId) {
        // ดึงข้อมูล user ที่ comment เพื่อสร้าง message
        const { data: user, error: userError } = await AuthRepository.getUserById(userId);
        
        if (!userError && user) {
          await NotificationService.createNotification({
            type: "comment",
            target_type: "post",
            target_id: postId,
            recipient_id: post.user_id, // ผู้เขียน post
            actor_id: userId, // ผู้ที่ comment
          });
        }
      }
    } catch (notificationError) {
      console.error("Failed to create comment notification:", notificationError);
      // ไม่ throw error เพื่อไม่ให้กระทบการ comment
    }

    return {
      success: true,
      message: "Created comment successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// GET Comments
export async function getComments(postId, queryParams) {
  try {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 6;

    const {
      data: comments,
      count: totalComments,
      error,
      truePage,
      truelimit,
    } = await PostsRepository.getComments(postId, {
      page,
      limit,
    });

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

    if (truePage * truelimit < totalComments) {
      results.nextPage = truePage + 1;
    }
    if (truePage > 1) {
      results.previousPage = truePage - 1;
    }

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Handle Likes
export async function handleLikes(userId, postId) {
  try {
    const { data: existing, error: checkError } =
      await PostsRepository.checkLike(userId, postId);

    if (checkError) {
      throw checkError;
    }

    const { data: post, error: postError } =
      await PostsRepository.getPostForLike(postId);

    if (postError) {
      throw postError;
    }

    if (existing) {
      await PostsRepository.removeLike(existing.id);
      await PostsRepository.updateLikesCount(
        postId,
        Math.max(post.likes_count - 1, 0)
      );

      return {
        success: true,
        status: "unliked",
      };
    } else {
      await PostsRepository.addLike(userId, postId);
      await PostsRepository.updateLikesCount(postId, post.likes_count + 1);

      // สร้าง notification สำหรับ like (เฉพาะตอน like)
      try {
        if (post.user_id !== userId) {
          // ดึงข้อมูล user ที่ like เพื่อสร้าง message
          const { data: user, error: userError } = await AuthRepository.getUserById(userId);
          
          if (!userError && user) {
            await NotificationService.createNotification({
              type: "like",
              target_type: "post",
              target_id: postId,
              recipient_id: post.user_id, // ผู้เขียน post
              actor_id: userId, // ผู้ที่ like
            });
          }
        }
      } catch (notificationError) {
        console.error("Failed to create like notification:", notificationError);
        // ไม่ throw error เพื่อไม่ให้กระทบการ like
      }

      return {
        success: true,
        status: "liked",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// GET Post Titles
export async function getPostTitles(status) {
  const statusId = parseInt(status);
  try {
    const { data, error } = await PostsRepository.getPostTitles(statusId);
    if (error) {
      throw new Error(
        "Server could not get post titles because database connection"
      );
    }

    return {
      success: true,
      data: data.map((post) => ({
        id: post.id,
        title: post.title,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
