import { getReport, createReport, removeReport, updateStatus, updateReport, ReportData } from "./modelsUtils.js";
import { IssueReport } from "../types/index.js";

interface IssueReportData extends ReportData {
  priority?: 'low' | 'medium' | 'high';
  user_id: number;
}

export const createIssueReport = async (reportData: IssueReportData): Promise<IssueReport> => {
    try {
        const insertedReport = await createReport(reportData, 'issue_reports');              
        return insertedReport as unknown as IssueReport;

    } catch (error: any) {
        console.error('Error creating issue report:', error);
        throw new Error(error?.message);
    }
};

export const removeIssueReportDB = async (reportId: number): Promise<IssueReport> => {
    try {
      const deleted = await removeReport(reportId, 'issue_reports');   
      return deleted[0] as unknown as IssueReport; // returns deleted report
        
    } catch (error) {
        console.error('Error removing report:', error);
        throw error;
    }
};

export const getReportById = async (reportId: number): Promise<IssueReport | null> => {
    try {
      const report = await getReport(reportId, 'issue_reports');
      return report as unknown as IssueReport;
        
    } catch (error) {
        throw new Error(error as string);
    }
};

export const updateIssueReportDB = async (reportData: IssueReportData): Promise<IssueReport> => {
  try {
    const updatedReport = await updateReport(reportData, 'issue_reports');
    return updatedReport as unknown as IssueReport;
    
  } catch (error) {
    console.error('Error updating issue report:', error);
    throw error;
  }
};

export const updateIssueReportStatusDB = async (reportId: number, newStatus: string): Promise<IssueReport> => {
  try {
    const updatedReport = await updateStatus(reportId, newStatus, 'issue_reports');
    return updatedReport as unknown as IssueReport;
    
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
};
