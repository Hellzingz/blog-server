import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import postRouter from "./routes/posts.mjs";
import authRouter from "./routes/auth.mjs";
import categoryRouter from "./routes/categories.mjs";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/posts', postRouter);
app.use('/auth', authRouter);
app.use('/categories', categoryRouter);

// Optional: root route for test
app.get("/", (req, res) => {
  res.send("Serverless Express on Vercel is working!");
});


export default (req, res) => app(req, res)