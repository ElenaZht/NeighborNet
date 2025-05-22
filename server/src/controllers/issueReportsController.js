import { createReport } from "../models/issueReportsModel.js"

export const addIssueReport = async (req, res) => {
    try {
        const { title, img_url, description } = req.body;
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
            description: description || null
        };
        
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