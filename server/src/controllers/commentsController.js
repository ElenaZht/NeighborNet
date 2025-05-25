import { getCommentsByReportId, addComment } from "../models/commentsModel.js";


export const getReportComments = async (req, res) => {
  try {
    const { reportId, reportType } = req.params;
    
    if (!reportId) {
      return res.status(400).json({ message: "Report ID is required" });
    }
    
    if (!reportType) {
      return res.status(400).json({ message: "Report type is required" });
    }
    
    // Valid report types based on your database
    const validReportTypes = ['offer_help', 'help_request', 'give_away', 'issue_report'];
    if (!validReportTypes.includes(reportType)) {
      return res.status(400).json({ message: "Invalid report type" });
    }
    
    const comments = await getCommentsByReportId(reportId, reportType);
    
    return res.status(200).json({
      message: "Comments retrieved successfully",
      comments
    });
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({
      message: "Failed to fetch comments",
      error: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message
    });
  }
};


export const createComment = async (req, res) => {
  try {
    const { reportId, reportType } = req.params;
    const { content } = req.body;
    const { id: user_id} = req.user;
    
    // Validate required fields
    if (!user_id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!reportId) {
      return res.status(400).json({ message: "Report ID is required" });
    }
    
    if (!reportType) {
      return res.status(400).json({ message: "Report type is required" });
    }
    
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content is required" });
    }
    
    // Valid report types based on your database
    const validReportTypes = ['offer_help', 'help_request', 'give_away', 'issue_report'];
    if (!validReportTypes.includes(reportType)) {
      return res.status(400).json({ message: "Invalid report type" });
    }
    
    const commentData = {
      user_id,
      report_id: reportId,
      report_type: reportType,
      content,
    };
    
    const createdComment = await addComment(commentData);
    
    return res.status(201).json({
      message: "Comment added successfully",
      comment: createdComment
    });
    
  } catch (error) {
    console.error('Error adding comment:', error);
    
    // Handle specific error cases
    if (error.message.includes('Report with ID') && error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message.includes('Invalid report type')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Failed to add comment",
      error: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message
    });
  }
};