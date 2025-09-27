import { Router } from "express";
import {
  deleteById,
  readAllPosts,
  createPost,
  readById,
  updatePost,
  createComment,
} from "../controllers/posts.mjs";
import { validatePost } from "../middlewares/posts.mjs";
import { protectAdmin } from "../middlewares/protectRoute.mjs";
import { imageFileUpload, uploadToSupabase } from "../middlewares/upload.mjs";

const postRouter = Router();

//POST
postRouter.post("/:postId/comments", createComment);
postRouter.post(
  "/",
  [protectAdmin, imageFileUpload, uploadToSupabase, validatePost],
  createPost
);

//GET
postRouter.get("/", readAllPosts);
postRouter.get("/:postId", readById);

//PUT
postRouter.put(
  "/:postId",
  protectAdmin,
  imageFileUpload,
  uploadToSupabase,
  validatePost,
  updatePost
);

//DELETE
postRouter.delete("/:postId", deleteById);

export default postRouter;
