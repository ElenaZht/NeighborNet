import { db } from "../config/db";

interface NeighborhoodData {
    id: number;
    nbr_name: string;
    nbr_name_en: string;
    city_name: string;
    city_name_en: string;
    city_gov_id: number;
    geometry?: any; // PostGIS geometry type
}

export const getNeighborhoodByCoordinates = async (lat: number, lng: number): Promise<NeighborhoodData | null> => {
    try {
        if (!lat || !lng) {
            throw new Error("Coordinates are missing");
        }

        // Note: longitude comes first in ST_Point(lng, lat)
        try {
            const result = await db('neighborhoods')
                .select('id', 'nbr_name', 'nbr_name_en', 'city_name', 'city_name_en', 'city_gov_id')
                .whereRaw('ST_Contains(geometry, ST_SetSRID(ST_Point(?, ?), 4326))', [lng, lat])
                .limit(1);
            
            return (result[0] as NeighborhoodData) || null;

        } catch (error) {
            console.log("get neighborhood error: ", error);
            return null;
        }
  
    } catch (error) {
        throw error;
    }
};

export const getNeighborhoodDB = async (neighborhoodId: number): Promise<NeighborhoodData | null> => {
    if (!neighborhoodId) return null;

    try {
        const result = await db('neighborhoods')
            .select('id', 'nbr_name', 'nbr_name_en', 'city_name', 'city_name_en', 'city_gov_id', 'geometry')
            .where('id', neighborhoodId)
            .first();
        
        if (!result) {
            console.log(`No neighborhood found with ID: ${neighborhoodId}`);
            return null;
        }
        
        return result as NeighborhoodData;
    } catch (error) {
        console.log("Get neighborhood by ID error:", error);
        throw error;
    }
};
