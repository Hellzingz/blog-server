import * as PostsRepository from "../repositories/postsRepository.mjs";

// สร้างโพสต์ใหม่
export async function createPost(postData, imageUrl) {
  try {
    // ตรวจสอบข้อมูลที่จำเป็น
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

// ดึงโพสต์ทั้งหมด
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

// ดึงโพสต์ตาม ID
export async function getPostById(postId) {
  try {
    const { data, error } = await PostsRepository.getPostById(postId);

    if (error) {
      throw new Error(
        "Server could not get post because database connection"
      );
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

// อัปเดตโพสต์
export async function updatePost(postId, updateData, imageUrl) {
  try {
    const date = new Date();
    const { title, category_id, description, content, status_id } =
      updateData;

    // ตรวจสอบว่าโพสต์มีอยู่หรือไม่
    const { data: existingPost, error: checkError } =
      await PostsRepository.checkPostExists(postId);

    if (checkError || !existingPost) {
      throw new Error("Post not found");
    }

    // อัปเดตโพสต์
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

// ลบโพสต์
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

// สร้างคอมเมนต์
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

// ดึงคอมเมนต์
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

// จัดการ like
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

//GET Post Titles
export async function getPostTitles(status) {
  const statusId = parseInt(status);
  try {
    const { data, error } = await PostsRepository.getPostTitles(statusId);
    if (error) {
      throw new Error("Server could not get post titles because database connection");
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
      error: error.message
    };
  }
}
