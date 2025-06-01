import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/usersRouter.js'
import path from 'path';
import { fileURLToPath } from 'url';
import issueReportsRouter from './routes/issueReportsRouter.js'
import giveAwaysReportsRouter from './routes/giveAwaysRouter.js'
import offerHelpReportsRouter from './routes/offerHelpRouter.js'
import helpRequestReporstRouter from './routes/helpRequestRouter.js'
import commentsRouter from './routes/commentsRouter.js'
import reportsRouter from './routes/reportsRouter.js'
import neighborhoodRouter from './routes/neighborhoodRouter.js'
import morgan from 'morgan';
import followersRouter from './routes/followersRouter.js'

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
app.use('/issue-reports', issueReportsRouter)
app.use('/give-aways', giveAwaysReportsRouter)
app.use('/offer-help', offerHelpReportsRouter)
app.use('/help-requests', helpRequestReporstRouter)
app.use('/comments', commentsRouter)
app.use('/reports', reportsRouter)
app.use('/neighborhood', neighborhoodRouter)
app.use('/followers', followersRouter)
app.use(morgan('dev')); // Logging middleware for development

app.listen(3001, (error) => {
    if (error){
        console.log("error:", error)
        return
    }
    console.log("server is running on port", 3001)
})