import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Get the directory of the current module (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build absolute path to the React build directory
const distPath = path.join(__dirname, '../../webUI/NeighborNet/dist');
const indexPath = path.join(distPath, 'index.html');

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
app.use(express.static(distPath));

// Fallback for any other routes not handled by API or static files
app.use((req, res) => {
    if (req.method === 'GET') {
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
