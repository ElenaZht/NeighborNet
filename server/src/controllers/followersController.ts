import { Request, Response } from 'express';
import { addFollowerRecord, removeFollowerRecord } from '../models/followersModel.js';
import { isValidReportType } from '../shared/reportTypes.js';
import { AuthRequest } from '../types/index.js';

export const addFollower = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { reportType, reportId } = req.params;
        const user_id = req.user?.user_id;

        if (!user_id) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        if (!isValidReportType(reportType)) {
            res.status(400).json({
                message: 'Invalid report type'
            });
            return;
        }

        if (!reportId) {
            res.status(400).json({
                message: 'Report ID is required'
            });
            return;
        }

        const follower = await addFollowerRecord({
            user_id: user_id,
            report_id: parseInt(reportId),
            report_type: reportType
        });

        res.status(201).json({
            message: 'Successfully followed report',
            follower
        });

    } catch (error) {
        console.error('Error adding follower:', error);
        
        if (error instanceof Error) {
            if (error.message.includes('already following')) {
                res.status(409).json({
                    message: 'Already following this report'
                });
                return;
            }
            
            if (error.message.includes('Report not found')) {
                res.status(404).json({
                    message: 'Report not found'
                });
                return;
            }
        }

        res.status(500).json({
            message: 'Failed to follow report',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const removeFollower = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { reportType, reportId } = req.params;
        const user_id = req.user?.user_id; 

        if (!user_id) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        if (!isValidReportType(reportType)) {
            res.status(400).json({
                message: 'Invalid report type'
            });
            return;
        }

        if (!reportId) {
            res.status(400).json({
                message: 'Report ID is required'
            });
            return;
        }

        const result = await removeFollowerRecord({
            user_id: user_id,
            report_id: parseInt(reportId),
            report_type: reportType
        });

        if (!result.success) {
            res.status(404).json({
                message: 'Follower relationship not found'
            });
            return;
        }

        res.status(200).json({
            message: 'Successfully unfollowed report'
        });

    } catch (error) {
        console.error('Error removing follower:', error);
        res.status(500).json({
            message: 'Failed to unfollow report',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
