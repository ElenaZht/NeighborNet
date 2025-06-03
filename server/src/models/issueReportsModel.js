import { getReport, createReport, removeReport, updateStatus, updateReport } from "./modelsUtils.js";


export const createIssueReport = async(reportData) => {
    try {
        const insertedReport = await createReport(reportData, 'issue_reports');              
        return insertedReport;

    } catch (error) {
        console.error('Error creating issue report:', error);
        throw new Error(error?.message)
    }
}

export const removeIssueReportDB = async (reportId) => {
    try {
      const deleted = await removeReport(reportId, 'issue_reports')   
      return deleted[0];// returns deleted report
        
    } catch (error) {
        console.error('Error removing report:', error);
        throw error;
    }
}

export const getReportById = async (reportId) => {
    try {
      const report = await getReport(reportId, 'issue_reports')
      return report
        
    } catch (error) {
        throw new Error(error)
    }
}

export const updateIssueReportDB = async (reportData) => {
  try {
    const updatedReport = await updateReport(reportData, 'issue_reports')
    return updatedReport;
    
  } catch (error) {
    console.error('Error updating issue report:', error);
    throw error;
  }
}

export const updateIssueReportStatusDB = async (reportId, newStatus) => {
  try {
    const updatedReport = await updateStatus(reportId, newStatus, 'issue_reports') 
    return updatedReport;
    
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
}