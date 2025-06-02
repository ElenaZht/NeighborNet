import { db } from "../config/db.js";
import { ReportStatus } from "../../../reportsStatuses.js";


export const getReport = async (reportId, tableName) => {
    try {
        if (!reportId){
            throw Error('No report id provided')
        }

        const report = await db(tableName)
            .where({ id: reportId })
            .first()

        if (!report){
            return null
        }

        return report
        
    } catch (error) {
        throw Error('Failed to fetch report: ', error)
    }
}

export const createReport = async (reportData, tableName) => {
  try {
    // Set default status to ACTIVE for all new reports if not already set
    if (!reportData.status) {
      reportData.status = ReportStatus.ACTIVE;
    }

    if (reportData.location && 
        reportData.location.lat && 
        reportData.location.lng &&
        !isNaN(parseFloat(reportData.location.lat)) && 
        !isNaN(parseFloat(reportData.location.lng))) {
        reportData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, 
          [parseFloat(reportData.location.lng), parseFloat(reportData.location.lat)])
    } else if (reportData.location) {
      // If location exists but is invalid, remove it
      delete reportData.location;
    }
    
    const [insertedReport] = await db(tableName)
      .insert(reportData)
      .returning('*');
      
    return insertedReport;
    
  } catch (error) {
    console.log(error)
    throw new Error(error?.message)
  }
}

export const removeReport = async (reportId, tableName) => {
    try {
        const report = await db(tableName)
            .where({ id: reportId })
            .first()

        if (!report){
            const error = new Error(`Report with id ${reportId} not found`);
            error.type = 'NOT_FOUND';
            throw error;
        }

        const deleted = await db(tableName)
            .where({ id: reportId })
            .delete()
            .returning('*');
            
        return deleted
        
    } catch (error) {
        console.error('Error removing report:', error);
        throw error;
    }
}

export const updateStatus = async (reportId, newStatus, tableName) => {
  try {
    // check if report exists
    const report = await getReport(reportId, tableName);
    if (!report) {
      const error = new Error(`Report with id ${reportId} not found`);
      error.type = 'NOT_FOUND';
      throw error;
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
}

export const updateReport = async (reportData, tableName) => {
  try {

    if (!reportData.id) {
      throw new Error('Report ID is required for update');
    }
    
    const { id, ...updateData } = reportData;
    
    if (updateData.location && 
        updateData.location.lat && 
        updateData.location.lng &&
        !isNaN(parseFloat(updateData.location.lat)) && 
        !isNaN(parseFloat(updateData.location.lng))) {
      updateData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, 
        [parseFloat(updateData.location.lng), parseFloat(updateData.location.lat)]);
    } else if (updateData.location) {
      // If location exists but is invalid, remove it from update to keep existing value
      delete updateData.location;
    }
    
    const existingReport = await db(tableName).where({ id }).first();
    if (!existingReport) {
      const error = new Error(`Report with ID ${id} not found`);
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
}
