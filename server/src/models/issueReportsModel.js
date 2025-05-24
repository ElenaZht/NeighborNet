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

export const updateReport = async (reportData) => {
  try {
    const {
      id, // Report ID
      title,
      description,
      img_url,
      address,
      lat,
      lon,
      upvotes,
      followers,
      verifies
    } = reportData;
    
    if (!id) {
      throw new Error('Report ID is required for update');
    }
    
    const updateData = {};
    
    // Only add fields that are explicitly provided
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (img_url !== undefined) updateData.img_url = img_url;
    if (address !== undefined) updateData.address = address;
    if (upvotes !== undefined) updateData.upvotes = upvotes;
    if (followers !== undefined) updateData.followers = followers;
    if (verifies !== undefined) updateData.verifies = verifies;
    
    if (lat !== undefined && lon !== undefined) {
      updateData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, [lon, lat]);
    }
    
    // Update the database record
    const [updatedReport] = await db('issue_reports')
      .where({ id })
      .update(updateData)
      .returning('*');
      
    return updatedReport;
  } catch (error) {
    console.error('Error updating issue report:', error);
    throw error;
  }
}