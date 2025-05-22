import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/usersRouter.js'
import path from 'path';
import { fileURLToPath } from 'url';
import issueReportsRouter from './routes/issueReportsRouter.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 
        process.env.DEV_FRONTEND_SERVER_URL 
        || process.env.DEV_FRONTEND_SERVER_URL2, // Vite default port
    credentials: true
  }));

// Serve static for client
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/', express.static(path.join(__dirname,'../../webUI/NeighborNet/dist')));
app.use('/users', usersRouter)
//todo * route for any unmatched routes

app.use('/issue-reports', issueReportsRouter)


app.listen(3001, (error) => {
    if (error){
        console.log("error:", error)
        return
    }
    console.log("server is running on port", 3001)
})