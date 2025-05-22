import { db } from '../config/db.js'

export const createReport = async(reportData) => {
    try {
        const [insertedReport] = await db('issue_reports')
            .insert(reportData)
            .returning(['id', 'created_at', 'userid', 'username', 'img_url', 
                      'title', 'description', 'upvotes', 'followers', 'verifies']);
                      
        return insertedReport;
    } catch (error) {
        console.error('Error creating issue report:', error);
        throw error;
    }
}