import { db } from '../config/db.js'


export const createReport = async(reportData) => {
    try {
        // convert lat lon to a PostGIS point
        if (reportData.lat && reportData.lon) {
            const { lat, lon, ...restData } = reportData;
            
            // Add the location as a PostGIS point
            const locationData = {
                ...restData,
                location: db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, [lon, lat])
            };
            
            const [insertedReport] = await db('issue_reports')
                .insert(locationData)
                .returning(['id', 'created_at', 'userid', 'username', 'img_url', 
                          'title', 'description', 'address', 'upvotes', 'followers', 'verifies']);
            
            return insertedReport;

        } else {
            // without location
            const [insertedReport] = await db('issue_reports')
                .insert(reportData)
                .returning(['id', 'created_at', 'userid', 'username', 'img_url', 
                          'title', 'description', 'address', 'upvotes', 'followers', 'verifies']);
                      
            return insertedReport;
        }
    } catch (error) {
        console.error('Error creating issue report:', error);
        throw error;
    }
}

export const removeReport = async (reportId) => {
    try {
        const report = await db('issue_reports')
            .where({ id: reportId })
            .first()
        if (!report){
            const error = new Error(`Report with id ${reportId} not found`);
            error.type = 'NOT_FOUND';
            throw error;
        }

        const deleted = await db('issue_reports')
            .where({ id: reportId })
            .delete()
            .returning('*');
            
        return deleted[0];// returns deleted report
        
    } catch (error) {
        console.error('Error removing report:', error);
        throw error;
    }
}

export const getReportById = async (reportId) => {
    try {
        if (!reportId){
            throw Error('No report id provided')
        }

        const report = await db('issue_reports')
            .where({ id: reportId })
            .first()

        if (!report){
            return null
        }

        return report
        
    } catch (error) {
        throw new Error(error)
    }
}