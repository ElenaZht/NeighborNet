import { Response, NextFunction } from 'express';
import { getReport } from "../models/modelsUtils.js";
import { AuthRequest } from '../types/index.js';

export const isAccountOwner = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }

    const requestedUserId = req.params.user_id;
    const authenticatedUserId = req.user.user_id; // Updated to match `user_id` naming convention

    // Check if authenticated user matches the requested user ID
    if (authenticatedUserId != parseInt(requestedUserId || '0')) {
        res.status(403).json({ 
            message: 'Forbidden: You can only perform this action on your own account' 
        });
        return;
    }

    next();
};

export const isReportOwner = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }

    const requestedReportId = req.params.reportId;
    const authenticatedUserId = req.user.user_id;

    if (!requestedReportId) {
        res.status(400).json({ message: 'Report ID is required' });
        return;
    }

    try {
        const report = await getReport(parseInt(requestedReportId));
        if (report) {
            if (report.user_id == authenticatedUserId) {
                next();
                return;
            } else {
                res.status(403).json({ 
                    message: 'Forbidden: You can only perform this action on your own report' 
                });
                return;
            }
        } else {
            res.status(404).json({ message: 'Report not found' });
            return;
        }
    } catch (error) {
        console.error('Error checking report ownership:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
