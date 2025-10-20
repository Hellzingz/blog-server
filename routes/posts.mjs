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
  getPostTitles,
} from "../controllers/posts.mjs";
import { validatePost } from "../middlewares/posts.mjs";
import { validateComment, validatePostId } from "../middlewares/validation.mjs";
import { protectAdmin } from "../middlewares/protectRoute.mjs";
import { imageFileUpload, uploadToSupabase } from "../middlewares/upload.mjs";

const postRouter = Router();

//POST Routes
postRouter.post("/:postId/comments", validatePostId, validateComment, createComment);
postRouter.post("/:postId/likes", validatePostId, handleLikes);
postRouter.post(
  "/",
  [protectAdmin, imageFileUpload, uploadToSupabase, validatePost],
  createPost
);

//GET Routes
postRouter.get("/", readAllPosts);
postRouter.get("/titles", getPostTitles);
postRouter.get("/:postId", validatePostId, readById);
postRouter.get("/:postId/comments", validatePostId, readComments);

//PUT Routes
postRouter.put(
  "/:postId",
  [protectAdmin, validatePostId, imageFileUpload, uploadToSupabase, validatePost],
  updatePost
);

//DELETE Routes
postRouter.delete("/:postId", protectAdmin, validatePostId, deleteById);

export default postRouter;
