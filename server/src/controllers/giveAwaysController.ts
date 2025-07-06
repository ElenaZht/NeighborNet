import { Request, Response } from 'express';
import { 
    createGiveAwayReport, 
    getReportById, 
    removeGiveAwayReportDB,
    updateGiveAwayReportDB,
    updateGiveAwayStatusDB
} from "../models/giveAwaysModel.js";
import { getNeighborhoodByCoordinates } from "../models/neighborhoodModel.js";
import { AuthRequest, GiveAway } from '../types/index.js';

interface GiveAwayData {
    user_id: number;
    username: string;
    title: string;
    description: string;
    img_url?: string;
    address?: string;
    city: string;
    is_free?: boolean;
    swap_options?: string;
    location?: {
        lat: number;
        lng: number;
    };
    neighborhood_id: number;
}

export const addGiveAwayReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { 
            title, 
            img_url, 
            description, 
            address, 
            location, 
            city, 
            is_free, 
            swap_options 
        } = req.body;
        const user_id = req.user?.user_id;
        const username = req.user?.username;

        // Check minimal necessary fields: user_id, title, address
        if (!user_id || !username) {
            res.status(401).json({
                message: 'Authentication required'
            });
            return;
        }
        if (!title || !title.trim()) {
            res.status(400).json({
                message: 'Title is required'
            });
            return;
        }
        
        if (!address || !address.trim()) {
            res.status(400).json({
                message: 'Address is required'
            });
            return;
        }

        // Prepare data for model
        const giveAwayData: GiveAwayData = { 
            user_id, 
            username, 
            title,
            description: description || '',
            city,
            neighborhood_id: 0 // Default value, will be updated if location is available
        };

        // Add optional fields
        if (img_url) giveAwayData.img_url = img_url;
        if (address) giveAwayData.address = address;
        if (location) giveAwayData.location = location;
        if (is_free !== undefined) giveAwayData.is_free = is_free;
        if (swap_options) giveAwayData.swap_options = swap_options;

        if (location) {
            // Detect neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng);
            if (neighborhood) {
                giveAwayData.neighborhood_id = neighborhood.id;
            }
        }

        const giveAway = await createGiveAwayReport(giveAwayData);
        
        res.status(201).json({
            message: 'Give-away created successfully',
            giveAway
        });
        
    } catch (error: any) {
        console.error('Error creating give-away:', error);
        res.status(500).json({
            message: 'Failed to create give-away',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
};

export const removeGiveAwayReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reportId = parseInt(req.params.reportId);
        if (!reportId) {
            res.status(400).json({ message: "Report id is missing" });
            return;
        }

        // Check if user is an owner
        const report = await getReportById(reportId);
        if (!report) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        if (report.user_id !== req.user?.user_id) {
            res.status(403).json({ message: "User is not an owner" });
            return;
        }

        const deletedReport = await removeGiveAwayReportDB(reportId);
        if (deletedReport) {
            // returns deleted report
            console.info("Report deleted, ", deletedReport);
            res.status(200).json({ message: "Report deleted successfully", deletedReport });
            return;
        }
        throw Error('Failed to delete report');
        
    } catch (error: any) {
        if (error.type == 'NOT_FOUND') {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(500).json({ message: "Failed to delete report: ", error });
    }
};

export const editGiveAwayReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reportId = parseInt(req.params.reportId);
        if (!reportId) {
            res.status(400).json({ message: "Report id is missing" });
            return;
        }

        // Check if user is the owner
        const report = await getReportById(reportId);
        if (!report) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        if (report.user_id !== req.user?.user_id) {
            res.status(403).json({ message: "User is not an owner" });
            return;
        }

        // Extract update data
        const { 
            title, 
            img_url, 
            description, 
            address, 
            location, 
            city, 
            is_free, 
            swap_options 
        } = req.body;
        
        // Check minimal required fields
        if (title !== undefined && (!title || !title.trim())) {
            res.status(400).json({ message: "Title cannot be empty" });
            return;
        }
        
        if (address !== undefined && (!address || !address.trim())) {
            res.status(400).json({ message: "Address cannot be empty" });
            return;
        }

        // Prepare update data
        const updateData: Partial<GiveAwayData> & { id: number } = {
            id: reportId,
            title,
            description: description || report.description,
            user_id: report.user_id,
            neighborhood_id: report.neighborhood_id
        };

        // Add optional fields
        if (img_url !== undefined) updateData.img_url = img_url;
        if (address !== undefined) updateData.address = address;
        if (city !== undefined) updateData.city = city;
        if (is_free !== undefined) updateData.is_free = is_free;
        if (swap_options !== undefined) updateData.swap_options = swap_options;
        if (location !== undefined) updateData.location = location;

        if (location) {
            // Detect new neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng);
            if (neighborhood) {
                updateData.neighborhood_id = neighborhood.id;
            }
        }
       
        // Update the report
        const updatedReport = await updateGiveAwayReportDB(updateData as GiveAwayData);
        
        res.status(200).json({
            message: "Report updated successfully",
            updatedReport
        });
        
    } catch (error: any) {
        console.error('Error updating report:', error);
        if (error.type === 'NOT_FOUND') {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(500).json({
            message: "Failed to update report",
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
};

export const updateReportStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reportId = parseInt(req.params.reportId);
        if (!reportId) {
            res.status(400).json({ message: "Report id is missing" });
            return;
        }

        const { newStatus } = req.body;
        if (!newStatus) {
            res.status(400).json({ message: "Report new status is missing" });
            return;   
        }

        const updatedReport = await updateGiveAwayStatusDB(reportId, newStatus);
        console.log("updatedreport", updatedReport);
        if (!updatedReport.status || updatedReport.status !== newStatus) {
            res.status(500).json({ message: "Failed to update report status" });
            return;
        }
        res.status(200).json({ message: "Status updated successfully", report: updatedReport });
        
    } catch (error: any) {
        console.error("Error updating status:", error);
        
        if (error.type === 'NOT_FOUND') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error occurred while updating status" });
        }
    }
};
