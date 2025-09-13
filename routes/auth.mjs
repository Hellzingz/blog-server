import { Router } from "express";
import { login,register,getUser,resetPassword,updateProfilePic } from "../controllers/auth.mjs";
import { imageFileUpload, uploadToSupabase } from "../middlewares/upload.mjs";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/get-user", getUser);
authRouter.put("/reset-password", resetPassword);
authRouter.put("/update-profile", imageFileUpload, uploadToSupabase, updateProfilePic);


export default authRouter;