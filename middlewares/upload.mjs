import multer from "multer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const multerUpload = multer({ storage: multer.memoryStorage() });

// รับไฟล์ฟิลด์เดียวชื่อ imageFile (ถ้าจะรับหลายฟิลด์ เปลี่ยนเป็น fields([...]))
export const imageFileUpload = multerUpload.single("imageFile");

// อัปโหลดไฟล์จาก req.file ไป Supabase แล้วเซ็ต req.imageUrl
export const uploadToSupabase = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "imageFile is required" });
    }

    const bucketName = "blog-project";
    const filePath = `posts/${Date.now()}_${req.file.originalname}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      return res.status(500).json({ error: "Upload failed", details: error.message });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(data.path);

    req.imageUrl = publicUrl;
    next();
  } catch (err) {
    next(err);
  }
};