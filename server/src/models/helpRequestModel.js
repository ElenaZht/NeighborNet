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