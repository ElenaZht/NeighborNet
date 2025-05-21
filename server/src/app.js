import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/usersRouter.js'


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 
        process.env.DEV_FRONTEND_SERVER_URL 
        || process.env.DEV_FRONTEND_SERVER_URL2, // Vite default port
    credentials: true
  }));

app.use('/users', usersRouter)

app.listen(3001, (error) => {
    if (error){
        console.log("error:", error)
        return
    }
    console.log("server is running on port", 3001)
})