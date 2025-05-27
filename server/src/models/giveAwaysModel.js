import { db } from "../config/db.js";


export async function createReport(giveAwayData) {
  try {
      // const {
      //   userid,
      //   username,
      //   img_url,
      //   title,
      //   description,
      //   location,
      //   address,
      //   city,
      //   street,
      //   neighborhood_id, 
      //   is_free,
      //   swap_options
      // } = giveAwayData;
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

    
    // Handle PostGIS point using raw expression
    // const locationData = {
    //   userid,
    //   username,
    //   img_url,
    //   title,
    //   description,
    //   address,
    //   city,
    //   is_free: is_free !== undefined ? is_free : true,
    //   swap_options: swap_options || null,
      
    // };

    

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
      latitude,
      longitude,
      city,
      neighborhood_id,
      is_free,
      swap_options
    } = reportData;
    
        console.log("Updating report with ID:", id);
    console.log("Neighborhood ID received:", neighborhood_id);
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
          console.log("Setting neighborhood_id in updateData:", neighborhood_id);
      updateData.neighborhood_id = neighborhood_id;
    if (is_free !== undefined) updateData.is_free = is_free;
    if (swap_options !== undefined) updateData.swap_options = swap_options;
    
    if (latitude !== undefined && longitude !== undefined) {
      updateData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, [longitude, latitude]);
    }
    // console.log("updateData", updateData)
    
        const existingReport = await db('give_aways').where({ id }).first();
    if (!existingReport) {
      throw new Error(`Report with ID ${id} not found`);
    }
    // Update the database record
    const [updatedReport] = await db('give_aways')
      .where({ id })
      .update(updateData)
      .returning('*');
    console.log("Updated neighborhood_id:", updatedReport.neighborhood_id);
    return updatedReport;

  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
}