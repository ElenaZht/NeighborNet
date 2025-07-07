import { Request, Response } from 'express';
import { getNeighborhoodDB } from '../models/neighborhoodModel';

export const getNeighborhoodById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    if (!id) {
        res.status(400).json({ 
            success: false, 
            message: 'Neighborhood ID is required' 
        });
        return;
    }
    
    try {
        const neighborhood = await getNeighborhoodDB(parseInt(id));
        if (!neighborhood) {
            res.status(404).json({ 
                success: false, 
                message: 'Neighborhood not found' 
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            data: neighborhood
        });
    } catch (error) {
        console.error('Error fetching neighborhood by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching neighborhood',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
