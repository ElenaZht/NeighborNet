import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import morgan from 'morgan';
import { config } from './config/index';

import usersRouter from './routes/usersRouter';
import issueReportsRouter from './routes/issueReportsRouter';
import giveAwaysReportsRouter from './routes/giveAwaysRouter';
import offerHelpReportsRouter from './routes/offerHelpRouter';
import helpRequestReportsRouter from './routes/helpRequestRouter';
import commentsRouter from './routes/commentsRouter';
import reportsRouter from './routes/reportsRouter';
import neighborhoodRouter from './routes/neighborhoodRouter';
import followersRouter from './routes/followersRouter';

const app = express();
app.use(morgan('dev')); // Logging middleware for development

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 
        process.env.DEV_FRONTEND_SERVER_URL 
        || process.env.DEV_FRONTEND_SERVER_URL2, // Vite default port
    credentials: true
}));

app.use('/users', usersRouter);
app.use('/issue-reports', issueReportsRouter);
app.use('/give-aways', giveAwaysReportsRouter);
app.use('/offer-help', offerHelpReportsRouter);
app.use('/help-requests', helpRequestReportsRouter);
app.use('/comments', commentsRouter);
app.use('/reports', reportsRouter);
app.use('/neighborhoods', neighborhoodRouter);
app.use('/followers', followersRouter);

// Serve static files for the React app
app.use(express.static(path.join(process.cwd(), 'webUI/NeighborNet/dist')));

// Catch-all handler: send back React's index.html file for SPA routing
app.get('/', (req, res) => {
    const indexPath = path.join(process.cwd(), 'webUI/NeighborNet/dist/index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error serving index.html:', err);
            res.status(500).send('Internal server error');
        }
    });
});

// Fallback for any other routes not handled by API or static files
app.use((req, res, next) => {
    if (req.method === 'GET') {
        const indexPath = path.join(process.cwd(), 'webUI/NeighborNet/dist/index.html');
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error('Error serving index.html:', err);
                res.status(500).send('Internal server error');
            }
        });
    } else {
        res.status(404).json({ error: 'Route not found' });
    }
});

app.listen(config.server.port, (error?: Error) => {
    if (error) {
        console.log("error:", error);
        return;
    }
    console.log("server is running on port", config.server.port);
});
