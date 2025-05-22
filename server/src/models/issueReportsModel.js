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