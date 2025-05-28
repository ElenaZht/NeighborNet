import { db } from "../config/db.js";


export async function createReport(offerHelpData) {
try {
  if (offerHelpData.location){
    offerHelpData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, 
      [offerHelpData.location.lat, offerHelpData.location.lng])
  }

  const [insertedOfferHelp] = await db('offer_help')
    .insert(offerHelpData)
    .returning('*');
    
  return insertedOfferHelp;

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

        const report = await db('offer_help')
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
        const report = await db('offer_help')
            .where({ id: reportId })
            .first()
        if (!report){
            const error = new Error(`Report with id ${reportId} not found`);
            error.type = 'NOT_FOUND';
            throw error;
        }

        const deleted = await db('offer_help')
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
      topic,
      description,
      address,
      location,
      city,
      neighborhood_id,
      barter_options
    } = reportData;
    
    if (!id) {
      throw new Error('Report ID is required for update');
    }
    
    const updateData = {};
    
    // Only add fields that are explicitly provided
    if (img_url !== undefined) updateData.img_url = img_url;
    if (topic !== undefined) updateData.topic = topic;
    if (description !== undefined) updateData.description = description;
    if (address !== undefined) updateData.address = address;
    if (barter_options !== undefined) {
      updateData.barter_options = barter_options ? JSON.stringify(barter_options) : null;
    }
    if (city !== undefined) updateData.city = city;
    if (updateData.location) {
      updateData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, [updateData.location.lat, updateData.location.lng]);
    }
    
    const existingReport = await db('offer_help').where({ id }).first();
    if (!existingReport) {
      throw new Error(`Report with ID ${id} not found`);
    }
    
    const [updatedReport] = await db('offer_help')
      .where({ id })
      .update(updateData)
      .returning('*');
      
    return updatedReport;
    
  } catch (error) {
    console.error('Error updating offer help report:', error);
    throw error;
  }
}