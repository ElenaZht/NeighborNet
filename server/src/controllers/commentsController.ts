import { Request, Response } from 'express';
import { getCommentsByReportId, addComment } from "../models/commentsModel.js";
import { isValidReportType } from "../shared/reportTypes.js";
import { AuthRequest } from '../types/index.js';

export const getReportComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reportId, reportType } = req.params;
    
    if (!reportId) {
      res.status(400).json({ message: "Report ID is required" });
      return;
    }
    
    if (!reportType) {
      res.status(400).json({ message: "Report type is required" });
      return;
    }
    
    if (!isValidReportType(reportType)) {
      res.status(400).json({ message: "Invalid report type" });
      return;
    }
    
    const comments = await getCommentsByReportId(parseInt(reportId), reportType);
    
    res.status(200).json({
      message: "Comments retrieved successfully",
      comments
    });
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      message: "Failed to fetch comments",
      error: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reportId, reportType } = req.params;
    const { content } = req.body;
    const user_id = req.user?.user_id;
    
    // Validate required fields
    if (!user_id) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    
    if (!reportId) {
      res.status(400).json({ message: "Report ID is required" });
      return;
    }
    
    if (!reportType) {
      res.status(400).json({ message: "Report type is required" });
      return;
    }
    
    if (!content || !content.trim()) {
      res.status(400).json({ message: "Comment content is required" });
      return;
    }
    
    if (!isValidReportType(reportType)) {
      res.status(400).json({ message: "Invalid report type" });
      return;
    }
    
    const commentData = {
      user_id: user_id,
      report_id: parseInt(reportId),
      report_type: reportType,
      content: content.trim(),
    };
    
    const createdComment = await addComment(commentData);
    
    res.status(201).json({
      message: "Comment added successfully",
      comment: createdComment
    });
    
  } catch (error) {
    console.error('Error adding comment:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('Report with ID') && error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
        return;
      }
      
      if (error.message.includes('Invalid report type')) {
        res.status(400).json({ message: error.message });
        return;
      }
    }
    
    res.status(500).json({
      message: "Failed to add comment",
      error: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
