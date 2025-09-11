import express from "express";
const postRouter = express.Router();
import { create, read } from "../controllers/posts.mjs";

postRouter.get("/", read);
postRouter.post("/", create);

export default postRouter;
