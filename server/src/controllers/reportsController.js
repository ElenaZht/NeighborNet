import {getAllReportsFromDB} from '../models/reportsModel.js'


export const getAllReports = async (req, res) => {
    try {
        const {neighborhood_id, limit=10, offset=0, city} = req.query
        const {filters, loc} = req.body
        const userId = req.user?.id || null;
        
        console.log("controller filters", filters)
        if (!city) {
            return res.status(400).json({message: "City is required"})
        }
        
        const allReports = await getAllReportsFromDB(city, neighborhood_id, loc, limit, offset, filters, userId)
        res.status(200).json({message: "Reports found", reports: allReports})
        return

    } catch (error) {
        console.error("Error in getAllReports controller:", error);
        res.status(500).json({
            message: `Failed to retrieve reports: ${error.message}`,
            error: error.message
        });
    }
}