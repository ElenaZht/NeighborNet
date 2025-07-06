import { Response } from 'express';
import { 
    createHelpRequestReport,     
    updateHelpRequestDB,         
    removeHelpRequestReportDB,   
    updateHelpRequestStatusDB,
    getReportById
} from "../models/helpRequestModel.js";
import { getNeighborhoodByCoordinates } from "../models/neighborhoodModel.js";
import { AuthRequest } from '../types/index.js';


interface HelpRequestData {
    user_id: number; 
    username: string;
    title: string;
    description: string;
    img_url?: string;
    address?: string;
    city: string;
    category: string;
    urgency?: 'low' | 'medium' | 'high';
    location?: {
        lat: number;
        lng: number;
    };
    neighborhood_id: number;
}

export const addHelpRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log('Request body:', req.body);
        console.log('User info:', req.user);

        const { 
            title, 
            img_url, 
            description, 
            address, 
            location, 
            city, 
            category, 
            urgency 
        } = req.body;
        const user_id = req.user?.user_id; 
        const username = req.user?.username;

        // Check minimal necessary fields: user_id, title, urgency, address
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
        if (!urgency) {
            res.status(400).json({
                message: 'Urgency is required'
            });
            return;
        }
        if (!address || !address.trim()) {
            res.status(400).json({
                message: 'Address is required'
            });
            return;
        }
        if (!category) {
            res.status(400).json({
                message: 'Category is required'
            });
            return;
        }

        // Prepare data for model
        const helpRequestData: HelpRequestData = { 
            user_id: user_id, 
            username, 
            title,
            description: description || '',
            address: address,
            category: category,
            urgency: urgency || 'medium',
            city,
            neighborhood_id: 0 // Default value, will be updated if location is available
        };

        if (img_url) helpRequestData.img_url = img_url;
        if (location) helpRequestData.location = location;
        
        if (location) {
            // Detect neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng);
            if (neighborhood) {
                helpRequestData.neighborhood_id = neighborhood.id;
            }
        }
        
        console.log('Help request data prepared for insertion:', helpRequestData);

        const helpRequest = await createHelpRequestReport(helpRequestData);
        
        console.log('Help request created successfully:', helpRequest);

        res.status(201).json({
            message: 'Help request created successfully',
            helpRequest
        });
        
    } catch (error: any) {
        console.error('Error creating help request:', error);
        res.status(500).json({
            message: 'Failed to create help request',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error.message
        });
    }
};

export const removeHelpReport = async (req: AuthRequest, res: Response): Promise<void> => {
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

        const deletedReport = await removeHelpRequestReportDB(reportId);
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

export const editHelpRequestReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reportId = parseInt(req.params.reportId);
        if (!reportId) {
            res.status(400).json({ message: "Report id is missing" });
            return;
        }

        const report = await getReportById(reportId);
        if (!report) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        
        if (report.user_id !== req.user?.user_id) {
            res.status(403).json({ message: "User is not an owner" });
            return;
        }
        
        const updateData: Partial<HelpRequestData> & { id: number } = { 
            id: reportId,
            title: req.body.title,
            description: req.body.description || report.description,
            category: req.body.category || report.category,
            urgency: req.body.urgency,
            user_id: report.user_id,
            neighborhood_id: report.neighborhood_id
        };

        // Add optional fields
        if (req.body.img_url !== undefined) updateData.img_url = req.body.img_url;
        if (req.body.address !== undefined) updateData.address = req.body.address;
        if (req.body.location !== undefined) updateData.location = req.body.location;
        if (req.body.city !== undefined) updateData.city = req.body.city;
        
        if (req.body.location) {
            // Detect another neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(req.body.location.lat, req.body.location.lng);
            if (neighborhood) {
                updateData.neighborhood_id = neighborhood.id;
            }
        }

        // Update the report
        const updatedReport = await updateHelpRequestDB(updateData as HelpRequestData);
        
        console.info("Help request updated: ", updatedReport);
        res.status(200).json({
            message: "Help request updated successfully",
            updatedReport
        });
        
    } catch (error: any) {
        console.error('Error updating help request:', error);
        if (error.type === 'NOT_FOUND') {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(500).json({
            message: "Failed to update help request",
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

        // Check if user is owner - add this validation
        const user_id = req.user?.user_id;
        if (!user_id) {
            console.log("update status user: user_id ", req.user, 'id', user_id)
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        const updatedReport = await updateHelpRequestStatusDB(reportId, newStatus, user_id);
        console.log("updatedreport", updatedReport);
        if (!updatedReport || !updatedReport.status || updatedReport.status !== newStatus) {
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
