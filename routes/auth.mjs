import { Router } from "express";
import { login, register, getUser, resetPassword, updateProfilePic } from "../controllers/auth.mjs";
import { validateRegistration, validateLogin, validatePasswordReset, validateProfileUpdate } from "../middlewares/auth.mjs";
import { imageFileUpload, uploadToSupabase } from "../middlewares/upload.mjs";

const authRouter = Router();

//POST Routes
authRouter.post("/register", validateRegistration, register);
authRouter.post("/login", validateLogin, login);

//GET Routes
authRouter.get("/get-user", getUser);

//PUT Routes
authRouter.put("/reset-password", validatePasswordReset, resetPassword);
authRouter.put("/update-profile", validateProfileUpdate, imageFileUpload, uploadToSupabase, updateProfilePic);

export default authRouter;