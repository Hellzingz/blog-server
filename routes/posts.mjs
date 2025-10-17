import { Router } from "express";
import {
  deleteById,
  readAllPosts,
  createPost,
  readById,
  updatePost,
  createComment,
  readComments,
  handleLikes,
} from "../controllers/posts.mjs";
import { validatePost } from "../middlewares/posts.mjs";
import { protectAdmin } from "../middlewares/protectRoute.mjs";
import { imageFileUpload, uploadToSupabase } from "../middlewares/upload.mjs";

const postRouter = Router();

//POST
postRouter.post("/:postId/comments", createComment);
postRouter.post("/:postId/likes", handleLikes);
postRouter.post(
  "/",
  [protectAdmin, imageFileUpload, uploadToSupabase, validatePost],
  createPost
);

//GET
postRouter.get("/", readAllPosts);
postRouter.get("/:postId", readById);
postRouter.get("/:postId/comments", readComments);

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
