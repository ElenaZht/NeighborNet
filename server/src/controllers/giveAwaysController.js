import { createReport } from "../models/giveAwaysModel.js";


export const addGiveAwayReport = async (req, res) => {
    try {
        const { title, img_url, description, address, lat, lon, is_free, swap_options } = req.body;
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
            swap_options: swap_options || null
        };
        if (lat && lon){
            giveAwayData.latitude = lat,
            giveAway.longitude = lon
        }
        
        const giveAway = await createReport(giveAwayData);
        
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