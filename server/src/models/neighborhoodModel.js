import { db } from "../config/db.js";


export const getNeighborhoodByCoordinates = async(lat, lng) => {
    try {
        if (!lat || !lng){
        throw new Error("Coordinates are missing")
        }
        const query = `
        SELECT id, nbr_name, nbr_name_en, city_name, city_name_en, city_gov_id
        FROM neighborhoods
        WHERE ST_Contains(
            geometry,
            ST_SetSRID(ST_Point($1, $2), 4326)
        )
        LIMIT 1;
        `;

        // Note: longitude comes first in ST_Point(lng, lat)
        try {
            const result = await db('neighborhoods')
            .select('id', 'nbr_name', 'nbr_name_en', 'city_name', 'city_name_en', 'city_gov_id')
            .whereRaw('ST_Contains(geometry, ST_SetSRID(ST_Point(?, ?), 4326))', [lng, lat])
            .limit(1);
        return result[0] || null;

        } catch (error) {
            console.log("get neighborhood error: ", error)
        }
  
    } catch (error) {
        throw error
    }

}

export const getNeighborhoodDB = async (neighborhoodId) => {
    if (!neighborhoodId) return null

    try {
        const result = await db('neighborhoods')
            .select('id', 'nbr_name', 'nbr_name_en', 'city_name', 'city_name_en', 'city_gov_id', 'geometry')
            .where('id', neighborhoodId)
            .first();
        
        if (!result) {
            console.log(`No neighborhood found with ID: ${neighborhoodId}`);
            return null;
        }
        
        return result;
    } catch (error) {
        console.log("Get neighborhood by ID error:", error);
        throw error;
    }
}