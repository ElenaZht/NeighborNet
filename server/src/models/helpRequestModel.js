import { db } from "../config/db.js";


export async function createReport(helpRequestData) {
  try {
    if (!helpRequestData.urgency){
      helpRequestData.urgency = 'normal'
    }
    
    if (helpRequestData.location) {
      helpRequestData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, 
        [helpRequestData.location.lat, helpRequestData.location.lng]);
    }
    
    const [insertedRequest] = await db('help_requests')
      .insert(helpRequestData)
      .returning('*');
      
    return insertedRequest;

  } catch (error) {
    console.log(error)
    throw new Error(error?.message)
  }

}

export const getReportById = async (reportId) => {
    try {
        if (!reportId){
            throw Error('No report id provided')
        }

        const report = await db('help_requests')
            .where({ id: reportId })
            .first()

        if (!report){
            return null
        }

        return report
        
    } catch (error) {
        throw Error('Failed to fetch report: ', error)
    }
}

export const removeReport = async (reportId) => {
    try {
        const report = await db('help_requests')
            .where({ id: reportId })
            .first()
        if (!report){
            const error = new Error(`Report with id ${reportId} not found`);
            error.type = 'NOT_FOUND';
            throw error;
        }

        const deleted = await db('help_requests')
            .where({ id: reportId })
            .delete()
            .returning('*');
            
        return deleted[0];// returns deleted report
        
    } catch (error) {
        console.error('Error removing report:', error);
        throw error;
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
      category,
      urgency
    } = reportData;
    
    if (!id) {
      throw new Error('Report ID is required for update');
    }
    
    const updateData = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (img_url !== undefined) updateData.img_url = img_url;
    if (address !== undefined) updateData.address = address;
    if (category !== undefined) updateData.category = category;
    if (urgency !== undefined) updateData.urgency = urgency;
        if (city !== undefined) updateData.city = city;
    if (neighborhood_id !== undefined) updateData.neighborhood_id = neighborhood_id;
    if (updateData.location) {
      updateData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, [updateData.location.lat, updateData.location.lng]);
    }
    
    const existingReport = await db('help_requests').where({ id }).first();
    if (!existingReport) {
      throw new Error(`Report with ID ${id} not found`);
    }
    // Update the database record
    const [updatedReport] = await db('help_requests')
      .where({ id })
      .update(updateData)
      .returning('*');
      
    return updatedReport;

  } catch (error) {
    console.error('Error updating help request:', error);
    throw error;
  }
}

export const updateStatus = async (reportId, newStatus) => {
  try {
    // check if report exists
    const report = await getReportById(reportId);
    if (!report) {
      const error = new Error(`Report with id ${reportId} not found`);
      error.type = 'NOT_FOUND';
      throw error;
    }

    // Update the status
    const [updatedReport] = await db('help_requests')
      .where({ id: reportId })
      .update({ status: newStatus })
      .returning('*');
      
    return updatedReport;
    
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
}
