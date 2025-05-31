import {getNeoghborhoodById} from '../models/neighborhoodModel.js'


export const getNeighborhoodById = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).json({ 
            success: false, 
            message: 'Neighborhood ID is required' 
        });
    }
    
    try {
        const neighborhood = await getNeoghborhoodById(id);
        console.log("found neighb", neighborhood)
        if (!neighborhood) {
            return res.status(404).json({ 
                success: false, 
                message: 'Neighborhood not found' 
            });
        }
        
        return res.status(200).json({
            success: true,
            data: neighborhood
        });
    } catch (error) {
        console.error('Error fetching neighborhood by ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching neighborhood',
            error: error.message
        });
    }
}