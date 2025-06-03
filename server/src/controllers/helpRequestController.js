import { 
    createHelpRequestReport,     
    updateHelpRequestDB,         
    removeHelpRequestReportDB,   
    updateHelpRequestStatusDB    
} from "../models/helpRequestModel.js";
import { getNeighborhoodByCoordinates } from "../models/neighborhoodModel.js";


export const addHelpRequest = async (req, res) => {
    try {
        const { 
            title, 
            img_url, 
            description, 
            address, 
            location, 
            city, 
            category, 
            urgency 
        } = req.body;
        const {id: userid, username} = req.user;

        // Check minimal necessary fields: userid, title, urgency, address
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
        if (!urgency) {
            return res.status(400).json({
                message: 'Urgency is required'
            });
        }
        if (!address || !address.trim()) {
            return res.status(400).json({
                message: 'Address is required'
            });
        }
        if (!category) {
            return res.status(400).json({
                message: 'Category is required'
            });
        }

        // Prepare data for model
        const helpRequestData = { 
            userid, 
            username, 
            title,
            img_url: img_url || null,
            description: description || null,
            address: address,
            category: category,
            urgency: urgency || 'normal',
            city,
            location
        };
        
        if (location) {
            //detect neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng)
            if (neighborhood){
                helpRequestData.neighborhood_id = neighborhood.id
            }
        }
        
        const helpRequest = await createHelpRequestReport(helpRequestData);
        
        return res.status(201).json({
            message: 'Help request created successfully',
            helpRequest
        });
        
    } catch (error) {
        console.error('Error creating help request:', error);
        return res.status(500).json({
            message: 'Failed to create help request',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
}

export const removeHelpReport = async (req, res) => {
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


        const deletedReport = await removeHelpRequestReportDB(reportId)
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

export const editHelpRequestReport = async (req, res) => {
    try {
        const reportId = req.params.reportId;
        if (!reportId) {
            return res.status(400).json({ message: "Report id is missing" });
        }

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
            description: req.body.description,
            img_url: req.body.img_url,
            address: req.body.address,
            category: req.body.category,
            urgency: req.body.urgency,
            location: req.body.location, 
            city: req.body.city
        };
        
        if (req.body.location) {
            //detect another neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(req.body.location.lat, req.body.location.lng)
            
            if (neighborhood !== undefined){
                updateData.neighborhood_id = neighborhood.id
            }
        }

        // Update the report
        const updatedReport = await updateHelpRequestDB(updateData);
        
        console.info("Help request updated: ", updatedReport);
        return res.status(200).json({
            message: "Help request updated successfully",
            updatedReport
        });
        
    } catch (error) {
        console.error('Error updating help request:', error);
        if (error.type === 'NOT_FOUND') {
            return res.status(404).json({ message: "Report not found" });
        }
        return res.status(500).json({
            message: "Failed to update help request",
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

        // Check if user is owner - add this validation
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({message: "Authentication required"});
        }

        const updatedreport = await updateHelpRequestStatusDB(reportId, newStatus, userId)
        console.log("updatedreport", updatedreport)
        if (!updatedreport || !updatedreport.status || updatedreport.status !== newStatus){
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