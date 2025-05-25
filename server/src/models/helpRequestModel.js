import { db } from "../config/db.js";

export async function createReport(helpRequestData) {
  const {
    userid,
    username,
    title,
    description,
    img_url,
    latitude,
    longitude,
    address,
    category,
    urgency
  } = helpRequestData;
  
  // Prepare base data object
  const locationData = {
    userid,
    username,
    title,
    description: description || null,
    img_url: img_url || null,
    address,
    category,
    urgency: urgency || 'normal'
  };
  
  // Add location if both latitude and longitude are provided
  if (latitude && longitude) {
    locationData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, [longitude, latitude]);
  }
  
  // Insert data into help_requests table
  const [insertedRequest] = await db('help_requests')
    .insert(locationData)
    .returning('*');
    
  return insertedRequest;
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
      latitude,
      longitude,
      category,
      urgency
    } = reportData;
    
    // Check if ID is provided
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
    
    if (latitude !== undefined && longitude !== undefined) {
      updateData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, [longitude, latitude]);
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
