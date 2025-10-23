import { Router } from "express";
import { login, register, getUser, resetPassword, updateAdminProfile, updateUserProfile } from "../controllers/auth.mjs";
import { validateRegistration, validateLogin, validatePasswordReset, validateAdminUpdate, validateUserProfileUpdate } from "../middlewares/auth.mjs";
import { protectUser, protectAdmin } from "../middlewares/protectRoute.mjs";
import { imageFileUpload, uploadToSupabase } from "../middlewares/upload.mjs";

const authRouter = Router();

//POST Routes
authRouter.post("/register", validateRegistration, register);
authRouter.post("/login", validateLogin, login);

//GET Routes
authRouter.get("/get-user", protectUser, getUser);

//PUT Routes
authRouter.put("/reset-password", protectUser, validatePasswordReset, resetPassword);
authRouter.put("/update-profile", protectAdmin, validateAdminUpdate, imageFileUpload, uploadToSupabase, updateAdminProfile);
authRouter.put("/update-user-profile", protectUser, validateUserProfileUpdate, imageFileUpload, uploadToSupabase, updateUserProfile);

export default authRouter;