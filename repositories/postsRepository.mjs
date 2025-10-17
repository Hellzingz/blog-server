import { supabase } from '../config/supabase.mjs';

export class PostsRepository {
  // สร้างโพสต์ใหม่
  static async createPost(postData) {
    const { data, error } = await supabase
      .from("posts")
      .insert([postData])
      .select("id");
    
    return { data, error };
  }

  // ดึงโพสต์ทั้งหมด (พร้อม pagination และ filter)
  static async getAllPosts(options = {}) {
    const {
      page = 1,
      limit = 6,
      keyword = "",
      category = "",
      status = ""
    } = options;

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

    // Filter by status
    if (status) {
      query = query.eq("status_id", status);
    }

    // Filter by keyword (title, content, description)
    if (keyword) {
      query = query.or(
        `title.ilike.%${keyword}%,content.ilike.%${keyword}%,description.ilike.%${keyword}%`
      );
    }

    const { data, count, error } = await query;
    return { data, count, error, truePage, truelimit };
  }

  // ดึงโพสต์ตาม ID
  static async getPostById(postId) {
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
    
    return { data, error };
  }

  // ตรวจสอบว่าโพสต์มีอยู่หรือไม่
  static async checkPostExists(postId) {
    const { data, error } = await supabase
      .from("posts")
      .select("id")
      .eq("id", postId)
      .single();
    
    return { data, error };
  }

  // อัปเดตโพสต์
  static async updatePost(postId, updateData) {
    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", postId)
      .select()
      .single();
    
    return { data, error };
  }

  // ลบโพสต์
  static async deletePost(postId) {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);
    
    return { error };
  }

  // สร้างคอมเมนต์
  static async createComment(commentData) {
    const { error } = await supabase
      .from("comments")
      .insert([commentData]);
    
    return { error };
  }

  // ดึงคอมเมนต์ (พร้อม pagination)
  static async getComments(postId, options = {}) {
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

  // ตรวจสอบการ like
  static async checkLike(userId, postId) {
    const { data, error } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .maybeSingle();
    
    return { data, error };
  }

  // ดึงข้อมูลโพสต์สำหรับ like
  static async getPostForLike(postId) {
    const { data, error } = await supabase
      .from("posts")
      .select("likes_count")
      .eq("id", postId)
      .single();
    
    return { data, error };
  }

  // ลบ like
  static async removeLike(likeId) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("id", likeId);
    
    return { error };
  }

  // เพิ่ม like
  static async addLike(userId, postId) {
    const { error } = await supabase
      .from("likes")
      .insert({ user_id: userId, post_id: postId });
    
    return { error };
  }

  // อัปเดตจำนวน like
  static async updateLikesCount(postId, likesCount) {
    const { error } = await supabase
      .from("posts")
      .update({ likes_count: likesCount })
      .eq("id", postId);
    
    return { error };
  }
}
