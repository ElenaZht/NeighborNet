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