import { createReport, removeReport, getReportById } from "../models/issueReportsModel.js"

export const addIssueReport = async (req, res) => {
    try {
        const { title, img_url, description, address, lat, lon } = req.body;
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
            address: address || null
        };
        if (lat && lon) {
            // Create a PostGIS point from lat/lon
            reportData.location = `POINT(${lon} ${lat})`;  // Note: PostGIS expects lon/lat order
        }
        
        // Call model function
        const report = await createReport(reportData);
        console.info("Issue report created: ", report)
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