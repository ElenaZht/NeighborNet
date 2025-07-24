import { db } from "../config/db";
import { ReportStatus } from "../shared/reportsStatuses";

interface LocationData {
  lat: number;
  lng: number;
}

export interface ReportData {
  id?: number;
  title: string;
  description: string;
  photo_url?: string;
  category?: string;
  status?: string;
  location?: LocationData;
  user_id?: number; // Made optional
  neighborhood_id: number;
  [key: string]: any;
}

export interface ReportResult {
  id: number;
  title: string;
  description: string;
  photo_url?: string;
  category: string;
  status: string;
  user_id: number;
  neighborhood_id: number;
  created_at: Date;
  updated_at: Date;
  [key: string]: any;
}

export const getReport = async (reportId: number, tableName?: string): Promise<ReportResult | null> => {
    try {
        if (!reportId) {
            throw new Error('No report id provided');
        }

        // If no table name provided, search across all report tables
        if (!tableName) {
            const tables = ['issue_reports', 'help_requests', 'give_aways', 'offer_help'];
            for (const table of tables) {
                const report = await db(table)
                    .where({ id: reportId })
                    .first();
                if (report) {
                    return report;
                }
            }
            return null;
        }

        const report = await db(tableName)
            .where({ id: reportId })
            .first();


        // Ensure the status field is always set
        if (report && !report.status) {
            console.warn('Report status is missing. Setting default to "No status".');
            report.status = 'No status';
        }


        return report || null;
        
    } catch (error) {
        console.error('Failed to fetch report:', error);
        throw new Error(`Failed to fetch report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const createReport = async (reportData: ReportData, tableName: string): Promise<ReportResult> => {
  try {
    // Set default status to ACTIVE for all new reports if not already set
    if (!reportData.status) {
      reportData.status = ReportStatus.ACTIVE;
    }

    if (reportData.location && 
        reportData.location.lat && 
        reportData.location.lng &&
        !isNaN(parseFloat(reportData.location.lat.toString())) && 
        !isNaN(parseFloat(reportData.location.lng.toString()))) {
        reportData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, 
          [parseFloat(reportData.location.lng.toString()), parseFloat(reportData.location.lat.toString())]) as any;
    } else if (reportData.location) {
      // If location exists but is invalid, remove it
      delete reportData.location;
    }
    
    // Create a copy of reportData to avoid modifying the original
    const insertData = { ...reportData };
    
    // Remove category field for tables that don't support it
    if (tableName !== 'help_requests' && insertData.category) {
      delete insertData.category;
    }
    
    // Ensure correct column name for user reference
    if (insertData.user_id) {
      insertData.user_id = insertData.user_id;
    }
    
    console.log('Data being inserted:', insertData);
    
    const [insertedReport] = await db(tableName)
      .insert(insertData)
      .returning('*');
      
    console.log("insertedReport", insertedReport, "tableName", tableName)  
    return insertedReport;
    
  } catch (error) {
    console.log(error);
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};

export const removeReport = async (reportId: number, tableName: string): Promise<ReportResult[]> => {
  return await db.transaction(async (trx) => {
    const report = await trx(tableName)
      .where({ id: reportId })
      .first();

    if (!report) {
      const error = new Error(`Report with id ${reportId} not found`) as any;
      error.type = 'NOT_FOUND';
      throw error;
    }

    // Get report type from table name
    const reportTypeMap: Record<string, string> = {
      'give_aways': 'give_away',
      'issue_reports': 'issue_report',
      'help_requests': 'help_request',
      'offer_help': 'offer_help'
    };
    const reportType = reportTypeMap[tableName];

    // Delete related records first
    await trx('comments')
      .where({ report_id: reportId, report_type: reportType })
      .del();
      
    await trx('followers')
      .where({ report_id: reportId, report_type: reportType })
      .del();

    // Delete the report
    const [deleted] = await trx(tableName)
      .where({ id: reportId })
      .delete()
      .returning('*');
      
    return [deleted];
  });
};

export const updateStatus = async (reportId: number, newStatus: string, tableName: string): Promise<ReportResult> => {
  try {
    // check if report exists
    const report = await getReport(reportId, tableName);
    if (!report) {
      const error = new Error(`Report with id ${reportId} not found`) as any;
      error.type = 'NOT_FOUND';
      throw error;
    }

    // Validate newStatus to prevent empty strings
    if (!newStatus || newStatus.trim() === '') {
      newStatus = 'No status';
    }

    // Update the status
    const [updatedReport] = await db(tableName)
      .where({ id: reportId })
      .update({ status: newStatus })
      .returning('*');
      
    return updatedReport; // Return the first (and only) element from the array
    
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
};

export const updateReport = async (reportData: ReportData, tableName: string): Promise<ReportResult> => {
  try {
    if (!reportData.id) {
      throw new Error('Report ID is required for update');
    }
    
    const { id, ...updateData } = reportData;
    
    if (updateData.location && 
        updateData.location.lat && 
        updateData.location.lng &&
        !isNaN(parseFloat(updateData.location.lat.toString())) && 
        !isNaN(parseFloat(updateData.location.lng.toString()))) {
      updateData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, 
        [parseFloat(updateData.location.lng.toString()), parseFloat(updateData.location.lat.toString())]) as any;
    } else if (updateData.location) {
      // If location exists but is invalid, remove it from update to keep existing value
      delete updateData.location;
    }
    
    const existingReport = await db(tableName).where({ id }).first();
    if (!existingReport) {
      const error = new Error(`Report with ID ${id} not found`) as any;
      error.type = 'NOT_FOUND';
      throw error;
    }
    
    // Update the database record
    const [updatedReport] = await db(tableName)
      .where({ id })
      .update(updateData)
      .returning('*');
      
    return updatedReport;

  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
};
