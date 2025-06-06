import { 
    createGiveAwayReport, 
    getReportById, 
    removeGiveAwayReportDB,
    updateGiveAwayReportDB,
    updateGiveAwayStatusDB
} from "../models/giveAwaysModel.js";
import { getNeighborhoodByCoordinates } from "../models/neighborhoodModel.js";


export const addGiveAwayReport = async (req, res) => {
    try {
        const { 
            title, 
            img_url, 
            description, 
            address, 
            location, 
            city, 
            is_free, 
            swap_options 
        } = req.body;
        const {id: userid, username} = req.user;

        // Check minimal nessesary fields: userid, title, address
        if (!userid || !username) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }
        if (!title || !title.trim()) {
            return res.status(400).json({
                message: 'Title is required'
            });
        }
        
        if (!address || !address.trim()) {
            return res.status(400).json({
                message: 'Address is required'
            });
        }

        // Prepare data for model
        const giveAwayData = { 
            userid, 
            username, 
            title,
            img_url: img_url || null,
            description: description || null,
            address: address || null,
            is_free: is_free !== undefined ? is_free : true,
            swap_options: swap_options || null,
            city,
            location
        };
        if (location){
            //detect neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng)
            if (neighborhood){
                giveAwayData.neighborhood_id = neighborhood.id
            }
        }


        const giveAway = await createGiveAwayReport(giveAwayData);
        
        return res.status(201).json({
            message: 'Give-away created successfully',
            giveAway
        });
        
    } catch (error) {
        console.error('Error creating give-away:', error);
        return res.status(500).json({
            message: 'Failed to create give-away',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
}

export const removeGiveAwayReport = async (req, res) => {
    try {
        const reportId = req.params.reportId
        if (!reportId){
            res.status(400).json({message: "Report id is missing"})
            return
        }

        // check if user an owner
        const report = await getReportById(reportId)
        if (!report){
            res.status(404).json({message: "Report not found"})
            return
        }
        if (report.userid !== req.user.id){
            res.status(403).json({message: "User is not an owner"})
            return
        }


        const deletedReport = await removeGiveAwayReportDB(reportId)
        if (deletedReport){
            // returns deleted report
            console.info("Report deleted, ", deletedReport)
            res.status(200).json({message: "Report deleted successfully", deletedReport})
            return
        }
        throw Error('Failed to delete report')
        
    } catch (error) {
        if (error.type == 'NOT_FOUND'){
            res.status(404).json({message: "Report not found"})
            return
        }
        res.status(500).json({message: "Failed to delete report: ", error})
    }
}

export const editGiveAwayReport = async (req, res) => {
    try {
        const reportId = req.params.reportId;
        if (!reportId) {
            return res.status(400).json({ message: "Report id is missing" });
        }

        // Check if user is the owner
        const report = await getReportById(reportId);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        if (report.userid !== req.user.id) {
            return res.status(403).json({ message: "User is not an owner" });
        }

        // Extract update data
        const { 
            title, 
            img_url, 
            description, 
            address, 
            location, 
            city, 
            is_free, 
            swap_options 
        } = req.body;
        
        // Check minimal required fields
        if (title !== undefined && (!title || !title.trim())) {
            return res.status(400).json({ message: "Title cannot be empty" });
        }
        
        if (address !== undefined && (!address || !address.trim())) {
            return res.status(400).json({ message: "Address cannot be empty" });
        }

        // Prepare update data
        const updateData = {
            id: reportId,
            title,
            img_url,
            description,
            address,
            is_free,
            swap_options,
            location, 
            city
        };

        if (location) {
            //detect new neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng)
            
            if (neighborhood !== undefined){
                updateData.neighborhood_id = neighborhood.id
            }
        }
       
        // Update the report
        const updatedReport = await updateGiveAwayReportDB(updateData);
        
        return res.status(200).json({
            message: "Report updated successfully",
            updatedReport
        });
        
    } catch (error) {
        console.error('Error updating report:', error);
        if (error.type === 'NOT_FOUND') {
            return res.status(404).json({ message: "Report not found" });
        }
        return res.status(500).json({
            message: "Failed to update report",
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
}

export const updateReportStatus = async (req, res) => {
    try {
        const reportId = req.params.reportId
        if (!reportId){
            res.status(400).json({message: "Report id is missing"})
            return
        }

        const {newStatus} = req.body
        if (!newStatus){
            res.status(400).json({message: "Report new status is missing"})
            return   
        }


        //Check is user an owner

        const updatedreport = await updateGiveAwayStatusDB(reportId, newStatus)
        console.log("updatedreport", updatedreport)
        if (!updatedreport.status || updatedreport.status !== newStatus){
            res.status(500).json({message: "Failed to update report status"})
            return
        }
        res.status(200).json({message: "Status updated successfully", report: updatedreport})
        
    } catch (error) {
        console.error("Error updating status:", error)
        
        if (error.type === 'NOT_FOUND') {
            res.status(404).json({message: error.message})
        } else {
            res.status(500).json({message: "Server error occurred while updating status"})
        }
    }
}