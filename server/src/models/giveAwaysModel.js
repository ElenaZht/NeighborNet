import { db } from "../config/db.js";


export async function createReport(giveAwayData) {
    const {
      userid,
      username,
      img_url,
      title,
      description,
      latitude,
      longitude,
      address,
      is_free,
      swap_options
    } = giveAwayData;
    
    // Handle PostGIS point using raw expression
    const locationData = {
      userid,
      username,
      img_url,
      title,
      description,
      address,
      is_free: is_free !== undefined ? is_free : true,
      swap_options: swap_options || null,
      
    };
    if (latitude && longitude){
        locationData.location =  db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, [latitude, longitude])
    }
    
    const [insertedGiveAway] = await db('give_aways')
      .insert(locationData)
      .returning('*');
      
    return insertedGiveAway;
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