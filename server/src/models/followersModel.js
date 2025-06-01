import { db } from '../config/db.js';


export const addFollowerRecord = async (followerData) => {
    try {
        const { user_id, report_id, report_type } = followerData;

        if (!user_id) throw new Error('User ID is required');
        if (!report_id) throw new Error('Report ID is required');
        if (!report_type) throw new Error('Report type is required');

        // Check if already following
        const existingFollower = await db('followers')
            .where({
                user_id,
                report_id,
                report_type
            })
            .first();

        if (existingFollower) {
            throw new Error('User is already following this report');
        }

        // Verify the report exists
        const reportTable = getReportTable(report_type);
        const reportExists = await db(reportTable)
            .where({ id: report_id })
            .first();

        if (!reportExists) {
            throw new Error(`Report not found in ${reportTable}`);
        }

        // Insert the follower record
        const [insertedFollower] = await db('followers')
            .insert({
                user_id,
                report_id,
                report_type
            })
            .returning(['id', 'user_id', 'report_id', 'report_type', 'created_at']);

        // Update the followers count in the report table
        await updateFollowersCount(report_type, report_id, 1);
        console.log("add follower", insertedFollower)
        return insertedFollower;

    } catch (error) {
        console.error('Error adding follower record:', error);
        throw error;
    }
};

export const removeFollowerRecord = async (followerData) => {
    try {
        const { user_id, report_id, report_type } = followerData;

        if (!user_id) throw new Error('User ID is required');
        if (!report_id) throw new Error('Report ID is required');
        if (!report_type) throw new Error('Report type is required');

        // Delete the follower record
        const deletedCount = await db('followers')
            .where({
                user_id,
                report_id,
                report_type
            })
            .del();

        if (deletedCount > 0) {
            // Update the followers count in the report table
            await updateFollowersCount(report_type, report_id, -1);
        }
        console.log("del follow", deletedCount)
        return {
            success: deletedCount > 0,
            deletedCount
        };

    } catch (error) {
        console.error('Error removing follower record:', error);
        throw error;
    }
};

// Helper function to get the correct table name for each report type
const getReportTable = (reportType) => {
    switch (reportType) {
        case 'offer_help':
            return 'offer_help';
        case 'help_request':
            return 'help_requests';
        case 'give_away':
            return 'give_aways';
        case 'issue_report':
            return 'issue_reports';
        default:
            throw new Error(`Invalid report type: ${reportType}`);
    }
};

// Helper function to update followers count in the respective report table
const updateFollowersCount = async (reportType, reportId, increment) => {
    try {
        const tableName = getReportTable(reportType);
        
        await db(tableName)
            .where({ id: reportId })
            .increment('followers', increment);
            
    } catch (error) {
        console.error('Error updating followers count:', error);
        // Don't throw here as the main operation succeeded
    }
};

export const getFollowersByReport = async (reportType, reportId) => {
    try {
        const followers = await db('followers as f')
            .join('users as u', 'f.user_id', '=', 'u.id')
            .where({
                'f.report_id': reportId,
                'f.report_type': reportType
            })
            .select(
                'f.id',
                'f.user_id',
                'u.username',
                'u.photo_url',
                'f.created_at'
            )
            .orderBy('f.created_at', 'desc');

        return followers;

    } catch (error) {
        console.error('Error getting followers by report:', error);
        throw error;
    }
};
