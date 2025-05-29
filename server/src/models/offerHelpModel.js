import { db } from "../config/db.js";
import { getReport, createReport, removeReport, updateStatus, updateReport } from "./modelsUtils.js";


export async function createOfferHelpReport(offerHelpData) {
  try {
    const insertedOfferHelp = await createReport(offerHelpData, 'offer_help')  
    return insertedOfferHelp;

  } catch (error) {
    console.log(error)
    throw new Error(error?.message)
  }
}

export const getReportById = async (reportId) => {
    try {
        const report = await getReport(reportId, 'offer_help')
        return report
        
    } catch (error) {
        throw Error('Failed to fetch report: ', error)
    }
}

export const removeOfferHelpDBReport = async (reportId) => {
    try {
      const deleted = await removeReport(reportId, 'offer_help') 
      return deleted[0];// returns deleted report
        
    } catch (error) {
        console.error('Error removing report:', error);
        throw error;
    }
}

export const updateOfferHelpReportDB = async (reportData) => {
  try {
    const updatedReport = await updateReport(reportData, 'offer_help')
    return updatedReport;
    
  } catch (error) {
    console.error('Error updating offer help report:', error);
    throw error;
  }
}

export const updateOfferHelpStatusDB = async (reportId, newStatus) => {
  try {
    const updatedReport = await updateStatus(reportId, newStatus, 'offer_help')
    return updatedReport;
    
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
}