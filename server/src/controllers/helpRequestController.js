import { createReport } from "../models/helpRequestModel.js";

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