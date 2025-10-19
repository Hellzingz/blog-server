import multer from "multer";
import { createClient } from "@supabase/supabase-js";

// สร้าง Supabase client สำหรับเชื่อมต่อกับ Supabase Storage
// - process.env.SUPABASE_URL: URL ของ Supabase project
// - process.env.SUPABASE_ANON_KEY: Public key สำหรับ authentication
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ตั้งค่า Multer สำหรับจัดการไฟล์ที่อัปโหลด
// - multer.memoryStorage(): เก็บไฟล์ใน memory แทนการบันทึกลง disk
// - ข้อดี: เร็ว, ไม่ต้องจัดการไฟล์ชั่วคราว
// - ข้อเสีย: ใช้ memory มากถ้าไฟล์ใหญ่
const multerUpload = multer({ storage: multer.memoryStorage() });

// สร้าง middleware สำหรับรับไฟล์ฟิลด์เดียวชื่อ "imageFile"
// - .single("imageFile"): รับไฟล์ 1 ไฟล์จาก field ชื่อ "imageFile"
// - ไฟล์จะถูกเก็บใน req.file (ไม่ใช่ req.files)
// - ถ้าต้องการรับหลายไฟล์ ใช้ .array() หรือ .fields()
export const imageFileUpload = multerUpload.single("imageFile");

// อัปโหลดไฟล์จาก req.file ไป Supabase Storage แล้วเซ็ต req.imageUrl
export const uploadToSupabase = async (req, res, next) => {
  try {
    // ตรวจสอบว่ามีไฟล์ที่อัปโหลดมาหรือไม่
    // req.file จะมีข้อมูลไฟล์ที่ Multer ประมวลผลแล้ว
    if (!req.file) {
      req.imageUrl = null; // หรือ req.imageUrl = undefined;
      return next(); // ไปต่อได้เลย
    }
    // กำหนดชื่อ bucket ใน Supabase Storage
    // bucket คือ "โฟลเดอร์" ที่เก็บไฟล์ใน Supabase
    const bucketName = "blog-project";

    // สร้าง path สำหรับไฟล์ใน bucket
    // - Date.now(): timestamp เพื่อให้ชื่อไฟล์ไม่ซ้ำ
    // - req.file.originalname: ชื่อไฟล์เดิมที่ผู้ใช้อัปโหลด
    const filePath = `posts/${Date.now()}_${req.file.originalname}`;

    // อัปโหลดไฟล์ไป Supabase Storage
    // - supabase.storage: เข้าถึง Supabase Storage API
    // - .from(bucketName): เลือก bucket ที่จะอัปโหลด
    // - .upload(filePath, fileBuffer, options): อัปโหลดไฟล์
    //   - filePath: path ที่จะเก็บไฟล์ใน bucket
    //   - req.file.buffer: ข้อมูลไฟล์ในรูปแบบ buffer (จาก memory storage)
    //   - options: ตัวเลือกการอัปโหลด
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype, // กำหนด MIME type ของไฟล์
        upsert: false, // ไม่เขียนทับไฟล์ที่มีอยู่
      });

    // ตรวจสอบ error จากการอัปโหลด
    if (error) {
      return res
        .status(500)
        .json({ error: "Upload failed", details: error.message });
    }

    // สร้าง public URL สำหรับไฟล์ที่อัปโหลดแล้ว
    // - supabase.storage.from(bucketName): เลือก bucket เดียวกัน
    // - .getPublicUrl(data.path): สร้าง URL ที่เข้าถึงได้จากภายนอก
    // - data.path: path ของไฟล์ที่อัปโหลดสำเร็จ
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(data.path);

    // เก็บ public URL ไว้ใน req.imageUrl เพื่อให้ controller ใช้ได้
    req.imageUrl = publicUrl;

    // เรียก next() เพื่อไปยัง middleware หรือ controller ถัดไป
    next();
  } catch (err) {
    // ส่ง error ไปยัง error handler middleware
    next(err);
  }
};
