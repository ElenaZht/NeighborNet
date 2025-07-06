import { Request, Response } from 'express';
import { 
    createOfferHelpReport, 
    getReportById, 
    removeOfferHelpDBReport,
    updateOfferHelpReportDB,
    updateOfferHelpStatusDB
} from "../models/offerHelpModel.js";
import { getNeighborhoodByCoordinates } from "../models/neighborhoodModel.js";
import { AuthRequest, OfferHelp } from '../types/index.js';

interface OfferHelpData {
    user_id: number;
    username: string;
    title: string;
    description: string;
    img_url?: string;
    address?: string;
    city: string;
    availability?: string;
    barter_options?: string;
    location?: {
        lat: number;
        lng: number;
    };
    neighborhood_id: number;
}

export const addOfferHelp = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { 
            title, 
            img_url, 
            description, 
            address, 
            location, 
            city, 
            barter_options 
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
                message: 'title is required'
            });
            return;
        }
        
        if (!address || !address.trim()) {
            res.status(400).json({
                message: 'Address is required'
            });
            return;
        }

        const offerHelpData: OfferHelpData = {
            user_id: req.user?.user_id || 0,
            username,
            title,
            description: description || '',
            address: address,
            city,
            neighborhood_id: 0 // Default value, will be updated if location is available
        };

        // Add optional fields
        if (img_url) offerHelpData.img_url = img_url;
        if (barter_options) offerHelpData.barter_options = barter_options;
        if (location) offerHelpData.location = location;
        
        // Add latitude and longitude if provided
        if (location) {
            // Detect neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng);
            if (neighborhood) {
                offerHelpData.neighborhood_id = neighborhood.id;
            }
        }
        
        // Call model function
        const offerHelp = await createOfferHelpReport(offerHelpData);
        
        res.status(201).json({
            message: 'Help offer created successfully',
            offerHelp
        });
        
    } catch (error: any) {
        console.error('Error creating help offer:', error);
        res.status(500).json({
            message: 'Failed to create help offer',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
};

export const removeOfferHelpReport = async (req: AuthRequest, res: Response): Promise<void> => {
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

        const deletedReport = await removeOfferHelpDBReport(reportId);
        if (deletedReport) {
            // returns deleted report
            console.info("Report deleted, ", deletedReport);
            res.status(200).json({ message: "Report deleted successfully", deletedReport });
            return;
        }
        
    } catch (error: any) {
        if (error.type == 'NOT_FOUND') {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(500).json({ message: "Failed to delete report: ", error });
    }
};

export const editOfferHelpReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reportId = parseInt(req.params.reportId);
        if (!reportId) {
            res.status(400).json({ message: "Report id is missing" });
            return;
        }

        // Check if report exists and user is the owner
        const report = await getReportById(reportId);
        if (!report) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        
        if (report.user_id !== req.user?.user_id) {
            res.status(403).json({ message: "User is not an owner" });
            return;
        }
        
        // Only include fields that are provided in the request
        const updateData: Partial<OfferHelpData> & { id: number } = { 
            id: reportId,
            user_id: report.user_id,
            neighborhood_id: report.neighborhood_id
        };
        
        // Add fields only if they exist in the request body
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.img_url !== undefined) updateData.img_url = req.body.img_url;
        if (req.body.address !== undefined) updateData.address = req.body.address;
        if (req.body.barter_options !== undefined) updateData.barter_options = req.body.barter_options;
        if (req.body.city !== undefined) updateData.city = req.body.city;
        if (req.body.location !== undefined) updateData.location = req.body.location;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        
        // Only try to detect neighborhood if we have valid coordinates
        if (req.body.location && 
            req.body.location.lat && 
            req.body.location.lng &&
            !isNaN(req.body.location.lat) && 
            !isNaN(req.body.location.lng)) {
            
            try {
                const neighborhood = await getNeighborhoodByCoordinates(
                    parseFloat(req.body.location.lat), 
                    parseFloat(req.body.location.lng)
                );
                
                if (neighborhood) {
                    updateData.neighborhood_id = neighborhood.id;
                }    
            } catch (neighborhoodError: any) {
                console.warn('Failed to detect neighborhood:', neighborhoodError.message);
            }
        }

        // Update the report
        const updatedReport = await updateOfferHelpReportDB(updateData as OfferHelpData);
        
        console.info("Help offer updated: ", updatedReport);
        res.status(200).json({
            message: "Help offer updated successfully",
            updatedReport
        });
        
    } catch (error: any) {
        console.error('Error updating help offer:', error);
        if (error.type === 'NOT_FOUND') {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(500).json({
            message: "Failed to update help offer",
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
        
        const updatedReport = await updateOfferHelpStatusDB(reportId, newStatus);
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
