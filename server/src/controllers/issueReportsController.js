import { 
    createIssueReport, 
    removeIssueReportDB, 
    getReportById,
    updateIssueReportDB,
    updateIssueReportStatusDB
} from "../models/issueReportsModel.js"
import { getNeighborhoodByCoordinates } from "../models/neighborhoodModel.js";


export const addIssueReport = async (req, res) => {
    try {
        const { 
            title, 
            img_url, 
            description, 
            address, 
            location, 
            city, 
        } = req.body;
        const {id: userid, username} = req.user
  
        // Validation checks
        if (!userid) return res.status(400).json({ message: 'User ID is required' });
        if (!username) return res.status(400).json({ message: 'Username is required' });
        if (!title) return res.status(400).json({ message: 'Title is required' });
        
        if (description && description.length > 500) {
            return res.status(400).json({ message: 'Description must be 500 characters or less' });
        }
        
        const reportData = { 
            userid, 
            username, 
            title,
            img_url: img_url || null,
            description: description || null,
            address: address || null,
            city,
            location
        };
        if (location) {
            //detect neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng)
            console.log("neighborhood", neighborhood)
            if (neighborhood){
                reportData.neighborhood_id = neighborhood.id
            } 
        }
        
        const report = await createIssueReport(reportData);

        return res.status(201).json({
            message: 'Issue report created successfully',
            report
        });
        
    } catch (error) {
        console.error('Error in addIssueReport:', error);
        return res.status(500).json({
            message: 'Failed to create issue report',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
}

export const removeIssueReport = async (req, res) => {
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


        const deletedReport = await removeIssueReportDB(reportId)
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

export const editIssueReport = async (req, res) => {
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
            description: req.body.description,
            upvotes: req.body.upvotes,
            followers: req.body.followers,
            verifies: req.body.verifies,
            city: req.body.city,
            location: req.body.location
        };
        
        if (req.body.location) {
            //detect another neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(req.body.location.lat, req.body.location.lng)
            
            if (neighborhood !== undefined){
                updateData.neighborhood_id = neighborhood.id
            }
        }

        // Update the report
        const updatedReport = await updateIssueReportDB(updateData);
        
        return res.status(200).json({
            message: "Issue report updated successfully",
            updatedReport
        });
        
    } catch (error) {
        console.error('Error updating issue report:', error);
        if (error.type === 'NOT_FOUND') {
            return res.status(404).json({ message: "Report not found" });
        }
        return res.status(500).json({
            message: "Failed to update issue report",
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
        const updatedreport = await updateIssueReportStatusDB(reportId, newStatus)
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