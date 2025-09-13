import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import postRouter from "./routes/posts.mjs"
import authRouter from "./routes/auth.mjs"
import categoryRouter from "./routes/categories.mjs"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 4001


app.use('/posts', postRouter)
app.use('/auth', authRouter)
app.use('/categories', categoryRouter)

app.get('/', (req, res)=>{
    res.send("Test")
})


app.listen(PORT, ()=>{
    console.log(`Server is running on PORT:${PORT}`); 
})