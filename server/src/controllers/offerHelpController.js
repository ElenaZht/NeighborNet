import { createReport } from "../models/offerHelpModel.js";

export const addOfferHelp = async (req, res) => {
    try {
        const { topic, img_url, description, address, lat, lon, barter_options } = req.body;
        const {id: userid, username} = req.user;

        // Check minimal necessary fields: userid, topic, address
        if (!userid || !username) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }
        if (!topic || !topic.trim()) {
            return res.status(400).json({
                message: 'topic is required'
            });
        }
        
        if (!address || !address.trim()) {
            return res.status(400).json({
                message: 'Address is required'
            });
        }

        // Prepare data for model
        const offerHelpData = { 
            userid, 
            username, 
            topic,
            img_url: img_url || null,
            description: description || null,
            address: address,
            barter_options: barter_options || null
        };
        
        // Add latitude and longitude if provided
        if (lat && lon) {
            offerHelpData.latitude = lat;
            offerHelpData.longitude = lon;
        }
        
        // Call model function
        const offerHelp = await createReport(offerHelpData);
        
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