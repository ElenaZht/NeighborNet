import { Request, Response } from 'express';
import { 
    createIssueReport, 
    removeIssueReportDB, 
    getReportById,
    updateIssueReportDB,
    updateIssueReportStatusDB
} from "../models/issueReportsModel.js";
import { getNeighborhoodByCoordinates } from "../models/neighborhoodModel.js";
import { AuthRequest, IssueReport } from '../types/index.js';

interface IssueReportData {
    user_id: number; // Updated from user_id
    neighborhood_id: number; // Made non-optional to resolve type compatibility
    username: string;
    title: string;
    description: string;
    img_url?: string;
    address?: string;
    city: string;
    location?: {
        lat: number;
        lng: number;
    };
}

export const addIssueReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { 
            title, 
            img_url, 
            description, 
            address, 
            location, 
            city, 
        } = req.body;
        
        const user_id = req.user?.user_id;
        const username = req.user?.username;
  
        // Validation checks
        if (!user_id) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }
        if (!username) {
            res.status(400).json({ message: 'Username is required' });
            return;
        }
        if (!title) {
            res.status(400).json({ message: 'Title is required' });
            return;
        }
        
        if (description && description.length > 500) {
            res.status(400).json({ message: 'Description must be 500 characters or less' });
            return;
        }
        
        const reportData: IssueReportData = {
            user_id: req.user?.user_id || 0,
            username, 
            title,
            description: description || '',
            city,
            neighborhood_id: 0 // Default value, will be updated if location is available
        };

        // Add optional fields if they exist
        if (img_url) reportData.img_url = img_url;
        if (address) reportData.address = address;
        if (location) reportData.location = location;
        
        if (location) {
            // Detect neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(location.lat, location.lng);
            console.log("neighborhood", neighborhood);
            if (neighborhood) {
                reportData.neighborhood_id = neighborhood.id;
            } 
        }
        
        const report = await createIssueReport(reportData);

        res.status(201).json({
            message: 'Issue report created successfully',
            report
        });
        
    } catch (error) {
        console.error('Error in addIssueReport:', error);
        res.status(500).json({
            message: 'Failed to create issue report',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const removeIssueReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reportId = req.params.reportId;
        if (!reportId) {
            res.status(400).json({ message: "Report id is missing" });
            return;
        }

        // Check if user is owner
        const report = await getReportById(parseInt(reportId));
        if (!report) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        
        if (report.user_id !== req.user?.user_id) {
            res.status(403).json({ message: "User is not an owner" });
            return;
        }

        const deletedReport = await removeIssueReportDB(parseInt(reportId));
        if (deletedReport) {
            console.info("Report deleted, ", deletedReport);
            res.status(200).json({ message: "Report deleted successfully", deletedReport });
            return;
        }
        
    } catch (error) {
        if (error && typeof error === 'object' && 'type' in error && error.type === 'NOT_FOUND') {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        
        console.error('Error in removeIssueReport:', error);
        res.status(500).json({
            message: 'Failed to delete issue report',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const editIssueReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reportId = req.params.reportId;
        if (!reportId) {
            res.status(400).json({ message: "Report id is missing" });
            return;
        }

        const reportData = req.body;
        if (!reportData) {
            res.status(400).json({ message: "Report data is missing" });
            return;
        }

        // Check if user is owner
        const existingReport = await getReportById(parseInt(reportId));
        if (!existingReport) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        
        if (existingReport.user_id !== req.user?.user_id) {
            res.status(403).json({ message: "User is not an owner" });
            return;
        }

        if (reportData.location) {
            // Detect neighborhood if possible
            const neighborhood = await getNeighborhoodByCoordinates(reportData.location.lat, reportData.location.lng);
            if (neighborhood) {
                reportData.neighborhood_id = neighborhood.id;
            }
        }

        reportData.id = parseInt(reportId);
        const editedReport = await updateIssueReportDB(reportData);
        
        if (editedReport) {
            console.info("Report edited: ", editedReport);
            res.status(200).json({ message: 'Report info edited successfully', editedReport });
            return;
        }
        
    } catch (error) {
        if (error && typeof error === 'object' && 'type' in error && error.type === 'NOT_FOUND') {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        
        console.error('Error in editIssueReport:', error);
        res.status(500).json({
            message: 'Failed to edit issue report',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateReportStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reportId = req.params.reportId;
        const { status } = req.body;
        
        if (!reportId) {
            res.status(400).json({ message: "Report id is missing" });
            return;
        }
        
        if (!status) {
            res.status(400).json({ message: "Status is missing" });
            return;
        }

        const updatedReport = await updateIssueReportStatusDB(parseInt(reportId), status);
        
        if (updatedReport) {
            console.info("Report status updated: ", updatedReport);
            res.status(200).json({ message: 'Report status updated successfully', updatedReport });
            return;
        }
        
    } catch (error) {
        if (error && typeof error === 'object' && 'type' in error && error.type === 'NOT_FOUND') {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        
        console.error('Error in updateReportStatus:', error);
        res.status(500).json({
            message: 'Failed to update report status',
            error: process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
