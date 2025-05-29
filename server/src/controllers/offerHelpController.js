import { 
    createOfferHelpReport, 
    getReportById, 
    removeOfferHelpDBReport,
    updateOfferHelpReportDB,
    updateOfferHelpStatusDB
} from "../models/offerHelpModel.js";
import { getNeighborhoodByCoordinates } from "../models/neighborhoodModel.js";


export const addOfferHelp = async (req, res) => {
    try {
        const { 
            title, 
            img_url, 
            description, 
            address, 
            location, 
            city, 
            barter_options 
        } = req.body;
        const {id: userid, username} = req.user;

        // Check minimal necessary fields: userid, title, address
        if (!userid || !username) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }
        if (!title || !title.trim()) {
            return res.status(400).json({
                message: 'title is required'
            });
        }
        
        if (!address || !address.trim()) {
            return res.status(400).json({
                message: 'Address is required'
            });
        }

        const offerHelpData = { 
            userid, 
            username, 
            title,
            img_url: img_url || null,
            description: description || null,
            address: address,
            barter_options: barter_options || null,
            city,
            location
        };
        
        // Add latitude and longitude if provided
        if (location) {
            //detect neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng)
            if (neighborhood){
                offerHelpData.neighborhood_id = neighborhood.id
            }
        }
        
        // Call model function
        const offerHelp = await createOfferHelpReport(offerHelpData);
        
        return res.status(201).json({
            message: 'Help offer created successfully',
            offerHelp
        });
        
    } catch (error) {
        console.error('Error creating help offer:', error);
        return res.status(500).json({
            message: 'Failed to create help offer',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
}

export const removeOfferHelpReport = async (req, res) => {
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


        const deletedReport = await removeOfferHelpDBReport(reportId)
        if (deletedReport){
            // returns deleted report
            console.info("Report deleted, ", deletedReport)
            res.status(200).json({message: "Report deleted successfully", deletedReport})
            return
        }
        
    } catch (error) {
        if (error.type == 'NOT_FOUND'){
            res.status(404).json({message: "Report not found"})
            return
        }
        res.status(500).json({message: "Failed to delete report: ", error})
    }
}

export const editOfferHelpReport = async (req, res) => {
    try {
        const reportId = req.params.reportId;
        if (!reportId) {
            return res.status(400).json({ message: "Report id is missing" });
        }

        // Check if report exists and user is the owner
        const report = await getReportById(reportId);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        
        if (report.userid !== req.user.id) {
            return res.status(403).json({ message: "User is not an owner" });
        }
        
        const updateData = { 
            id: reportId,
            title: req.body.title,
            img_url: req.body.img_url,
            address: req.body.address,
            barter_options: req.body.barter_options,
            city: req.body.city,
            location: req.body.location,
            description: req.body.description
        };
        
        if (location) {
            //detect another neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng)
            
            if (neighborhood !== undefined){
                updateData.neighborhood_id = neighborhood.id
            }    
        }

        // Update the report
        const updatedReport = await updateOfferHelpReportDB(updateData);
        
        console.info("Help offer updated: ", updatedReport);
        return res.status(200).json({
            message: "Help offer updated successfully",
            updatedReport
        });
        
    } catch (error) {
        console.error('Error updating help offer:', error);
        if (error.type === 'NOT_FOUND') {
            return res.status(404).json({ message: "Report not found" });
        }
        return res.status(500).json({
            message: "Failed to update help offer",
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
}

export const getOfferHelpRequest = async (req, res) => {
    try {
        const reportId = req.params.reportId
        if (!reportId){
            res.status(400).json({message: "Report id is missing"})
            return
        }

        const report = await getReportById(reportId)
        if (!report){
            res.status(404).json({message: "Report not found"})
            return
        }

        res.status(200).json({message: "Report found successfully", report})
        return

    } catch (error) {
        res.status(500).json({message: `Failed to fetch report: ${error.toString()}`})
        console.info("Faile to get report: ", error)
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
        const updatedreport = await updateOfferHelpStatusDB(reportId, newStatus)
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