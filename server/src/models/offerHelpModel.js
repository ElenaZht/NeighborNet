import { db } from "../config/db.js";

export async function createReport(offerHelpData) {
  const {
    userid,
    username,
    img_url,
    topic,
    description,
    latitude,
    longitude,
    address,
    barter_options
  } = offerHelpData;
  
  // Prepare base data object
  const locationData = {
    userid,
    username,
    img_url,
    topic,
    description,
    address,
    barter_options: barter_options ? JSON.stringify(barter_options) : null
  };
  
  // Add location if both latitude and longitude are provided
  if (latitude && longitude) {
    locationData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, [longitude, latitude]);
  }
  
  // Insert data into offer_help table
  const [insertedOfferHelp] = await db('offer_help')
    .insert(locationData)
    .returning('*');
    
  return insertedOfferHelp;
}