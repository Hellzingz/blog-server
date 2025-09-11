import express from "express";
const postRouter = express.Router();
import { create, deleteById, read ,readById,update } from "../controllers/posts.mjs";

//GET
postRouter.get("/", read);
postRouter.get("/:postId", readById);

//POST
postRouter.post("/", create);

//PUT
postRouter.put("/:postId", update);

//DELETE
postRouter.delete("/:postId", deleteById);



export default postRouter;
