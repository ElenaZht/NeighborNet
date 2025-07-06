import { getReport, createReport, removeReport, updateStatus, updateReport, ReportData } from "./modelsUtils.js";
import { GiveAway } from "../types/index.js";

interface GiveAwayData extends ReportData {
  condition?: string;
  pickup_location?: string;
}

export async function createGiveAwayReport(giveAwayData: GiveAwayData): Promise<GiveAway> {
  try {
    // Adjust the data to ensure the correct column name is used
    const adjustedData = { ...giveAwayData, user_id: giveAwayData.user_id };
    const insertedGiveAway = await createReport(adjustedData, 'give_aways');
    return insertedGiveAway as unknown as GiveAway;
  } catch (error: any) {
    throw new Error(error?.message);
  }
}

export const getReportById = async (reportId: number): Promise<GiveAway | null> => {
    try {
        const report = await getReport(reportId, 'give_aways');
        return report as unknown as GiveAway;
        
    } catch (error) {
        throw Error('Failed to fetch report: ' + error);
    }
};

export const removeGiveAwayReportDB = async (reportId: number): Promise<GiveAway> => {
    try {
        const deleted = await removeReport(reportId, 'give_aways');
        return deleted[0] as unknown as GiveAway; // returns deleted report
        
    } catch (error) {
        console.error('Error removing report:', error);
        throw error;
    }
};

export const updateGiveAwayReportDB = async (reportData: GiveAwayData): Promise<GiveAway> => {
  try {
    const updatedReport = await updateReport(reportData, 'give_aways');
    return updatedReport as unknown as GiveAway;

  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
};

export const updateGiveAwayStatusDB = async (reportId: number, newStatus: string): Promise<GiveAway> => {
  try {
    const updatedReport = await updateStatus(reportId, newStatus, 'give_aways');
    return updatedReport as unknown as GiveAway;
    
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
};
