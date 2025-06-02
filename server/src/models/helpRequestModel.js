import { db } from "../config/db.js";
import { getReport, createReport, removeReport, updateStatus, updateReport } from "./modelsUtils.js";


export async function createHelpRequestReport(helpRequestData) {
  try {
    if (!helpRequestData.urgency){
      helpRequestData.urgency = 'normal'
    }
    
    const insertedRequest = await createReport(helpRequestData, 'help_requests')
     
    return insertedRequest;

  } catch (error) {
    throw new Error(error?.message)
  }

}

export const getReportById = async (reportId) => {
    try {
      const report = await getReport(reportId, 'help_requests')
      return report
        
    } catch (error) {
        throw Error('Failed to fetch report: ', error)
    }
}

export const removeHelpRequestReportDB = async (reportId) => {
    try {
      const deleted = await removeReport(reportId, 'help_requests')
      return deleted[0];// returns deleted report
        
    } catch (error) {
        console.error('Error removing report:', error);
        throw error;
    }
}

export const updateHelpRequestDB = async (reportData) => {
  try {
    const updatedReport = await updateReport(reportData, 'help_requests')
    return updatedReport;

  } catch (error) {
    console.error('Error updating help request:', error);
    throw error;
  }
}

export const updateHelpRequestStatusDB = async (reportId, newStatus, userId = null) => {
    try {
        const updatedReport = await updateStatus(reportId, newStatus, 'help_requests');
        return updatedReport;
    } catch (error) {
        console.error('Error updating help request status:', error);
        throw error;
    }
};
