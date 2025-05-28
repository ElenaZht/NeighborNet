import { db } from "../config/db.js";


export async function createReport(giveAwayData) {
  try {

    if (giveAwayData.location){
        giveAwayData.location =  db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, [giveAwayData.location.lat, giveAwayData.location.lng])
    }

      const [insertedGiveAway] = await db('give_aways')
        .insert(giveAwayData)
        .returning('*');
      
    return insertedGiveAway;
    
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

        const report = await db('give_aways')
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
        const report = await db('give_aways')
            .where({ id: reportId })
            .first()
        if (!report){
            const error = new Error(`Report with id ${reportId} not found`);
            error.type = 'NOT_FOUND';
            throw error;
        }

        const deleted = await db('give_aways')
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
      img_url,
      title,
      description,
      address,
      location,
      city,
      neighborhood_id,
      is_free,
      swap_options
    } = reportData;

    if (!id) {
      throw new Error('Report ID is required for update');
    }
    
    const updateData = {};
    
    if (img_url !== undefined) updateData.img_url = img_url;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (neighborhood_id !== undefined) updateData.neighborhood_id = neighborhood_id;
    if (is_free !== undefined) updateData.is_free = is_free;
    if (swap_options !== undefined) updateData.swap_options = swap_options;
    if (reportData.locatin) {
      updateData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, [reportData.location.lat, reportData.location.lng]);
    }
    
    const existingReport = await db('give_aways').where({ id }).first();
    if (!existingReport) {
      throw new Error(`Report with ID ${id} not found`);
    }
    // Update the database record
    const [updatedReport] = await db('give_aways')
      .where({ id })
      .update(updateData)
      .returning('*');
      
    return updatedReport;

  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
}