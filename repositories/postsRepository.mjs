import { supabase } from "../config/supabase.mjs";

// CREATE Post
export async function createPost(postData) {
  const { data, error } = await supabase
    .from("posts")
    .insert([postData])
    .select("id");

  return { data, error };
}

// GET All Posts
export async function getAllPosts(options = {}) {
  const {
    page = 1,
    limit = 6,
    searchId = "",
    keyword = "",
    category = "",
    status = "",
  } = options;

  const truePage = Math.max(1, page);
  const truelimit = Math.max(1, Math.min(100, limit));
  const offset = (truePage - 1) * truelimit;

  // Query
  let query = supabase
    .from("posts")
    .select(
      `
      id, image, title, description, date, content, likes_count,
      categories!inner(id, name),
      statuses(id, status),
      users!inner(id, name, profile_pic)
    `,
      { count: "exact" }
    )
    .order("date", { ascending: false })
    .range(offset, offset + truelimit - 1);

  // Filter by category
  if (category) {
    query = query.eq("category_id", category);
  }

  // Filter by status
  if (status) {
    query = query.eq("status_id", status);
  }

  // Filter by serchId
  if (searchId) {
    query = query.eq("id", searchId);
  }

  // Filter by keyword
  if (keyword && keyword.trim() !== "") {
    query = query.or(
      `title.ilike.%${keyword}%,content.ilike.%${keyword}%,description.ilike.%${keyword}%`
    );
  }

  const { data, count, error } = await query;
  return { data, count, error, truePage, truelimit };
}

// GET Post by ID
export async function getPostById(postId) {
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
      statuses!inner(status),
      users!inner(id, name, profile_pic, bio)
    `
    )
    .eq("id", postId)
    .single();

  return { data, error };
}

// CHECK Post Exists
export async function checkPostExists(postId) {
  const { data, error } = await supabase
    .from("posts")
    .select("id")
    .eq("id", postId)
    .single();

  return { data, error };
}

// UPDATE Post
export async function updatePost(postId, updateData) {
  const { data, error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", postId)
    .select()
    .single();

  return { data, error };
}

// DELETE Post
export async function deletePost(postId) {
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  return { error };
}

// CREATE Comment
export async function createComment(commentData) {
  const { error } = await supabase.from("comments").insert([commentData]);

  return { error };
}

// GET Comments
export async function getComments(postId, options = {}) {
  const { page = 1, limit = 6 } = options;
  const truePage = Math.max(1, page);
  const truelimit = Math.max(1, Math.min(100, limit));
  const offset = (truePage - 1) * truelimit;

  const { data, count, error } = await supabase
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
    .eq("post_id", postId)
    .order("created_at", { ascending: false })
    .range(offset, offset + truelimit - 1);

  return { data, count, error, truePage, truelimit };
}

// CHECK Like
export async function checkLike(userId, postId) {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .maybeSingle();

  return { data, error };
}

// GET Post for Like
export async function getPostForLike(postId) {
  const { data, error } = await supabase
    .from("posts")
    .select("likes_count")
    .eq("id", postId)
    .single();

  return { data, error };
}

// REMOVE Like
export async function removeLike(likeId) {
  const { error } = await supabase.from("likes").delete().eq("id", likeId);

  return { error };
}

// ADD Like
export async function addLike(userId, postId) {
  const { error } = await supabase
    .from("likes")
    .insert({ user_id: userId, post_id: postId });

  return { error };
}

// UPDATE Likes Count
export async function updateLikesCount(postId, likesCount) {
  const { error } = await supabase
    .from("posts")
    .update({ likes_count: likesCount })
    .eq("id", postId);

  return { error };
}

//GET Post Titles
export async function getPostTitles(statusId) {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title")
    .eq("status_id", statusId)
    .order("date", { ascending: false });
  return { data, error };
}
