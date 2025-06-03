import { getReport, createReport, removeReport, updateStatus, updateReport } from "./modelsUtils.js";


export async function createGiveAwayReport(giveAwayData) {
  try {
    const insertedGiveAway = await createReport(giveAwayData, 'give_aways') 
    return insertedGiveAway;
    
  } catch (error) {
    throw new Error(error?.message)
  }
}

export const getReportById = async (reportId) => {
    try {
        const report = await getReport(reportId, 'give_aways')
        return report
        
    } catch (error) {
        throw Error('Failed to fetch report: ', error)
    }
}

export const removeGiveAwayReportDB = async (reportId) => {
    try {

        const deleted = await removeReport(reportId, 'give_aways')
        return deleted[0];// returns deleted report
        
    } catch (error) {
        console.error('Error removing report:', error);
        throw error;
    }
}

export const updateGiveAwayReportDB = async (reportData) => {
  try {
    const updatedReport = await updateReport(reportData, 'give_aways')
    return updatedReport;

  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
}

export const updateGiveAwayStatusDB = async (reportId, newStatus) => {
  try {
    const [updatedReport] = await updateStatus(reportId, newStatus, 'give_aways')
    return updatedReport;
    
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
}