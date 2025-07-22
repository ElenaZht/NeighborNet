import { Response } from 'express';
import { getAllReportsFromDB } from '../models/reportsModel';
import { AuthRequest } from '../types/index';

interface ReportsQuery {
    neighborhood_id?: string;
    limit?: string;
    offset?: string;
    city?: string;
}

interface ReportsBody {
    filters?: any;
    loc?: any;
}

export const getAllReports = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { neighborhood_id, limit = '10', offset = '0', city }: ReportsQuery = req.query as ReportsQuery;
        const { filters, loc }: ReportsBody = req.body;
        const user_id = req.user?.user_id || null;
                
        if (!city) {
            res.status(400).json({ message: "City is required" });
            return;
        }
        const allReports = await getAllReportsFromDB(
            city, 
            neighborhood_id ? parseInt(neighborhood_id) : null, 
            loc, 
            parseInt(limit), 
            parseInt(offset), 
            filters, 
            user_id as any
        );
        res.status(200).json({ message: "Reports found", reports: allReports });

    } catch (error) {
        console.error("Error in getAllReports controller:", error);
        res.status(500).json({
            message: `Failed to retrieve reports: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
