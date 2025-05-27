import { db } from "../config/db.js";


export const getCommentsByReportId = async (reportId, reportType) => {
  try {
    if (!reportId) {
      throw new Error('Report ID is required');
    }
    
    if (!reportType) {
      throw new Error('Report type is required');
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

    // const ccc = await db.raw("select * from comments where report_type='give_away'")
    // console.log("ccc", ccc.rows);

    return comments;
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const addComment = async (commentData) => {
  try {
    const {
      user_id,
      report_id,
      report_type,
      content,
    } = commentData;
    
    // Validate required fields
    if (!user_id) throw new Error('User ID is required');
    if (!report_id) throw new Error('Report ID is required');
    if (!report_type) throw new Error('Report type is required');
    if (!content) throw new Error('Comment content is required');
    
    // Check if the referenced report exists
    const reportTable = 
      report_type === 'offer_help' ? 'offer_help' :
      report_type === 'help_request' ? 'help_requests' :
      report_type === 'give_away' ? 'give_aways' :
      report_type === 'issue_report' ? 'issue_reports' : null;
      
    if (!reportTable) {
      throw new Error(`Invalid report type: ${report_type}`);
    }
    
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
    
    return createdComment;
    
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};