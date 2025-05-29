import { db } from "../config/db.js";


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

    if (reportData.location){
        reportData.location =  db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, 
          [reportData.location.lat, reportData.location.lng])
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
            
        return deleted[0];// returns deleted report
        
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

    //Check is user an owner


    // Update the status
    const updatedReport = await db(tableName)
      .where({ id: reportId })
      .update({ status: newStatus })
      .returning('*');
      
    return updatedReport;
    
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
    
    if (reportData.locatin) {
      reportData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography`, [reportData.location.lat, reportData.location.lng]);
    }
    
    const existingReport = await db(tableName).where({ id }).first();
    if (!existingReport) {
      throw new Error(`Report with ID ${id} not found`);
    }
    // Update the database record
    const updatedReport = await db(tableName)
      .where({ id })
      .update(reportData)
      .returning('*');
      
    return updatedReport;

  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
}
