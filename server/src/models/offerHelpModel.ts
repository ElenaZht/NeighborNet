import { getReport, createReport, removeReport, updateStatus, updateReport, ReportData } from "./modelsUtils";
import { OfferHelp } from "../types/index";

interface OfferHelpData extends ReportData {
  availability?: string;
  user_id: number;
}

export async function createOfferHelpReport(offerHelpData: OfferHelpData): Promise<OfferHelp> {
  try {
    const insertedOfferHelp = await createReport(offerHelpData, 'offer_help');
    return insertedOfferHelp as unknown as OfferHelp;

  } catch (error: any) {
    console.log(error);
    throw new Error(error?.message);
  }
}

export const getReportById = async (reportId: number): Promise<OfferHelp | null> => {
    try {
        const report = await getReport(reportId, 'offer_help');
        return report as unknown as OfferHelp;
        
    } catch (error) {
        throw Error('Failed to fetch report: ' + error);
    }
};

export const removeOfferHelpDBReport = async (reportId: number): Promise<OfferHelp> => {
    try {
      const deleted = await removeReport(reportId, 'offer_help');
      return deleted[0] as unknown as OfferHelp; // returns deleted report
        
    } catch (error) {
        console.error('Error removing report:', error);
        throw error;
    }
};

export const updateOfferHelpReportDB = async (reportData: OfferHelpData): Promise<OfferHelp> => {
  try {
    const updatedReport = await updateReport(reportData, 'offer_help');
    return updatedReport as unknown as OfferHelp;
    
  } catch (error) {
    console.error('Error updating offer help report:', error);
    throw error;
  }
};

export const updateOfferHelpStatusDB = async (reportId: number, newStatus: string): Promise<OfferHelp> => {
  try {
    const updatedReport = await updateStatus(reportId, newStatus, 'offer_help');
    return updatedReport as unknown as OfferHelp;
    
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
};
