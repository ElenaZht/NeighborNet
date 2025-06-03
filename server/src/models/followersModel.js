import { db } from '../config/db.js';
import { isValidReportType } from '../../../reportTypes.js';

export const addFollowerRecord = async (followerData) => {
    try {
        const { user_id, report_id, report_type } = followerData;

        if (!user_id) throw new Error('User ID is required');
        if (!report_id) throw new Error('Report ID is required');
        if (!report_type) throw new Error('Report type is required');

        // Validate report type using centralized validation
        if (!isValidReportType(report_type)) {
            throw new Error(`Invalid report type: ${report_type}`);
        }

        // Use transaction for atomic operation
        return await db.transaction(async (trx) => {
            // Check if already following
            const existingFollower = await trx('followers')
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
            const reportExists = await trx(reportTable)
                .where({ id: report_id })
                .first();

            if (!reportExists) {
                throw new Error(`Report not found in ${reportTable}`);
            }

            // Insert the follower record
            const [insertedFollower] = await trx('followers')
                .insert({
                    user_id,
                    report_id,
                    report_type
                })
                .returning(['id', 'user_id', 'report_id', 'report_type', 'created_at']);

            // Update the followers count in the report table
            await trx(reportTable)
                .where({ id: report_id })
                .increment('followers', 1);

            console.log("add follower", insertedFollower);
            return insertedFollower;
        });

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

        // Validate report type using centralized validation
        if (!isValidReportType(report_type)) {
            throw new Error(`Invalid report type: ${report_type}`);
        }

        // Use transaction for atomic operation
        return await db.transaction(async (trx) => {
            const deletedCount = await trx('followers')
                .where({
                    user_id,
                    report_id,
                    report_type
                })
                .del();

            if (deletedCount > 0) {
                // Update the followers count in the report table
                const reportTable = getReportTable(report_type);
                await trx(reportTable)
                    .where({ id: report_id })
                    .decrement('followers', 1);
            }

            console.log("del follow", deletedCount);
            return {
                success: deletedCount > 0,
                deletedCount
            };
        });

    } catch (error) {
        console.error('Error removing follower record:', error);
        throw error;
    }
};

// Helper function to get the correct table name for each report type
const getReportTable = (reportType) => {
    const tableMap = {
        'offer_help': 'offer_help',
        'help_request': 'help_requests',
        'give_away': 'give_aways',
        'issue_report': 'issue_reports'
    };
    
    return tableMap[reportType];
};

export const getFollowersByReport = async (reportType, reportId) => {
    try {
        // Validate report type using centralized validation
        if (!isValidReportType(reportType)) {
            throw new Error(`Invalid report type: ${reportType}`);
        }

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
