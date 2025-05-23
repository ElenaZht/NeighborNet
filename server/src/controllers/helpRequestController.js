import { createReport, getReportById, removeReport } from "../models/helpRequestModel.js";

export const addHelpRequest = async (req, res) => {
    try {
        const { title, img_url, description, address, lat, lon, category, urgency } = req.body;
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
            urgency: urgency || 'normal'
        };
        
        // Add latitude and longitude if provided
        if (lat && lon) {
            helpRequestData.latitude = lat;
            helpRequestData.longitude = lon;
        }
        
        // Call model function
        const helpRequest = await createReport(helpRequestData);
        
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