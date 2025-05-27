import { 
    createReport, 
    removeReport, 
    getReportById,
    updateReport
} from "../models/issueReportsModel.js"
import { getNeighborhoodByCoordinates } from "../models/neighborhoodModel.js";


export const addIssueReport = async (req, res) => {
    try {
        const { title, img_url, description, address, location, city, } = req.body;
        const {id: userid, username} = req.user
  
        // Validation checks
        if (!userid) return res.status(400).json({ message: 'User ID is required' });
        if (!username) return res.status(400).json({ message: 'Username is required' });
        if (!title) return res.status(400).json({ message: 'Title is required' });
        
        // Optional field validation (if needed)
        if (description && description.length > 100) {
            return res.status(400).json({ message: 'Description must be 100 characters or less' });
        }
        
        // Prepare data for model
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
        
        const report = await createReport(reportData);

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


        const deletedReport = await removeReport(reportId)
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

        const { title, img_url, description, address, location, city, upvotes, followers, verifies } = req.body;
        
        const updateData = { 
            id: reportId,
            title,
            img_url,
            description,
            upvotes,
            followers,
            verifies,
            city,
            location
        };
        
        if (location) {
            //detect another neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lon)
            
            if (neighborhood !== undefined){
                updateData.neighborhood_id = neighborhood.id
            }
        }

        // Update the report
        const updatedReport = await updateReport(updateData);
        
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

export const getIssueReport = async (req, res) => {
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