import { getReport, createReport, removeReport, updateStatus, updateReport, ReportData } from "./modelsUtils.js";
import { HelpRequest } from "../types/index.js";

interface HelpRequestData extends ReportData {
  user_id: number; // Added user_id to ensure it is included in the data
  urgency?: 'low' | 'medium' | 'high';
}

export async function createHelpRequestReport(helpRequestData: HelpRequestData): Promise<HelpRequest> {
  try {
    if (!helpRequestData.urgency) {
      helpRequestData.urgency = 'medium';
    }
    
    const insertedRequest = await createReport(helpRequestData, 'help_requests');
     
    return insertedRequest as unknown as HelpRequest;

  } catch (error: any) {
    throw new Error(error?.message);
  }
}

export const getReportById = async (reportId: number): Promise<HelpRequest | null> => {
    try {
      const report = await getReport(reportId, 'help_requests');
      return report as unknown as HelpRequest;
        
    } catch (error) {
        throw Error('Failed to fetch report: ' + error);
    }
};

export const removeHelpRequestReportDB = async (reportId: number): Promise<HelpRequest> => {
    try {
      const deleted = await removeReport(reportId, 'help_requests');
      return deleted[0] as unknown as HelpRequest; // returns deleted report
        
    } catch (error) {
        console.error('Error removing report:', error);
        throw error;
    }
};

export const updateHelpRequestDB = async (reportData: HelpRequestData): Promise<HelpRequest> => {
  try {
    const updatedReport = await updateReport(reportData, 'help_requests');
    return updatedReport as unknown as HelpRequest;

  } catch (error) {
    console.error('Error updating help request:', error);
    throw error;
  }
};

export const updateHelpRequestStatusDB = async (reportId: number, newStatus: string, userId?: number | null): Promise<HelpRequest> => {
    try {
        const updatedReport = await updateStatus(reportId, newStatus, 'help_requests');
        return updatedReport as unknown as HelpRequest;
    } catch (error) {
        console.error('Error updating help request status:', error);
        throw error;
    }
};
