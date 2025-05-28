import { db } from '../config/db.js'


export const createReport = async(reportData) => {
    try {
        // convert lat lng to a PostGIS point
        if (reportData.location) {
            reportData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, 
                [reportData.location.lat, reportData.location.lng])

        }
        const [insertedReport] = await db('issue_reports')
            .insert(reportData)
            .returning('*');
                      
        return insertedReport;

    } catch (error) {
        console.error('Error creating issue report:', error);
        throw new Error(error?.message)
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
      location,
      city,
      neighborhood_id,
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
    if (city !== undefined) updateData.city = city;
    if (neighborhood_id !== undefined) updateData.neighborhood_id = neighborhood_id;
    if (upvotes !== undefined) updateData.upvotes = upvotes;
    if (followers !== undefined) updateData.followers = followers;
    if (verifies !== undefined) updateData.verifies = verifies;
    
    if (reportData.location) {
      updateData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, [reportData.location.lat, reportData.location.lng]);
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