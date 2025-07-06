import { db } from "../config/db.js";
import { isValidReportType } from "../shared/reportTypes.js";
import { Comment } from "../types/index.js";

interface CommentData {
  user_id: number;
  report_id: number;
  report_type: string;
  content: string;
}

interface CommentWithUserInfo extends Comment {
  id: number;
  user_id: number;
  username: string;
  img_url?: string;
  report_id: number;
  report_type: string;
  datetime: Date;
  content: string;
}

export const getCommentsByReportId = async (reportId: number, reportType: string): Promise<CommentWithUserInfo[]> => {
  try {
    if (!reportId) {
      throw new Error('Report ID is required');
    }
    
    if (!reportType) {
      throw new Error('Report type is required');
    }
    
    // Use centralized validation
    if (!isValidReportType(reportType)) {
      throw new Error(`Invalid report type: ${reportType}`);
    }
    
    // Join with users table to get the latest username and photo_url
    const comments = await db('comments as c')
      .join('users as u', 'c.user_id', '=', 'u.id')
      .where({ 
        'c.report_id': reportId,
        'c.report_type': reportType
      })
      .orderBy('c.datetime', 'desc')
      .select(
        'c.id',
        'c.user_id',
        'u.username', // Get username from users table
        'u.photo_url as img_url', // Get photo_url from users table
        'c.report_id',
        'c.report_type',
        'c.datetime',
        'c.content'
      );

    return comments as CommentWithUserInfo[];
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Helper function for table mapping
const getTableForReportType = (reportType: string): string => {
  const tableMap: Record<string, string> = {
    'offer_help': 'offer_help',
    'help_request': 'help_requests',
    'give_away': 'give_aways',
    'issue_report': 'issue_reports'
  };
  
  return tableMap[reportType];
};

export const addComment = async (commentData: CommentData): Promise<CommentWithUserInfo> => {
  try {
    const {
      user_id,
      report_id,
      report_type,
      content,
    } = commentData;
    
    if (!user_id) throw new Error('User ID is required');
    if (!report_id) throw new Error('Report ID is required');
    if (!report_type) throw new Error('Report type is required');
    if (!content) throw new Error('Comment content is required');
    
    // Use centralized validation
    if (!isValidReportType(report_type)) {
      throw new Error(`Invalid report type: ${report_type}`);
    }
    
    // Get table name using helper function
    const reportTable = getTableForReportType(report_type);
    
    const reportExists = await db(reportTable)
      .where({ id: report_id })
      .first();
      
    if (!reportExists) {
      throw new Error(`Report with ID ${report_id} not found in ${reportTable}`);
    }
    
    // Create the comment
    const [insertedComment] = await db('comments')
      .insert({
        user_id,
        report_id,
        report_type,
        content
      })
      .returning('id');
      
    // Fetch the complete comment with user data (same format as getCommentsByReportId)
    const [createdComment] = await db('comments as c')
    .join('users as u', 'c.user_id', '=', 'u.id')
    .where('c.id', insertedComment.id)
    .select(
        'c.id',
        'c.user_id',
        'u.username',
        'u.photo_url as img_url',
        'c.report_id',
        'c.report_type',
        'c.datetime',
        'c.content'
    );
    
    return createdComment as CommentWithUserInfo;
    
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};
