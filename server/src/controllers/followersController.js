import { addFollowerRecord, removeFollowerRecord } from '../models/followersModel.js';
import { isValidReportType } from '../../../reportTypes.js';

export const addFollower = async (req, res) => {
    try {
        const { reportType, reportId } = req.params;
        const userId = req.user.id;

        if (!isValidReportType(reportType)) {
            return res.status(400).json({
                message: 'Invalid report type'
            });
        }

        const follower = await addFollowerRecord({
            user_id: userId,
            report_id: parseInt(reportId),
            report_type: reportType
        });

        return res.status(201).json({
            message: 'Successfully followed report',
            follower
        });

    } catch (error) {
        console.error('Error adding follower:', error);
        
        if (error.message.includes('already following')) {
            return res.status(409).json({
                message: 'Already following this report'
            });
        }
        
        if (error.message.includes('Report not found')) {
            return res.status(404).json({
                message: 'Report not found'
            });
        }

        return res.status(500).json({
            message: 'Failed to follow report',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
};

export const removeFollower = async (req, res) => {
    try {
        const { reportType, reportId } = req.params;
        const userId = req.user.id;

        if (!isValidReportType(reportType)) {
            return res.status(400).json({
                message: 'Invalid report type'
            });
        }

        const result = await removeFollowerRecord({
            user_id: userId,
            report_id: parseInt(reportId),
            report_type: reportType
        });

        if (!result.success) {
            return res.status(404).json({
                message: 'Follower relationship not found'
            });
        }

        return res.status(200).json({
            message: 'Successfully unfollowed report'
        });

    } catch (error) {
        console.error('Error removing follower:', error);
        return res.status(500).json({
            message: 'Failed to unfollow report',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
};