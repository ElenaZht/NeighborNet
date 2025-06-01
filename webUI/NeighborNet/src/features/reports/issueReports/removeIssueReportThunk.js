import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from "../../../utils/apiClient";

export const removeIssueReport = createAsyncThunk(
    'issueReports/remove',
    async (reportId, { rejectWithValue }) => {
        try {
            const response = await del(`${import.meta.env.VITE_DEV_BASE_URL}/issue-reports/${reportId}`, 
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response) {
                throw new Error('Invalid response from server');
            }

            return reportId; // Return the ID of the deleted report
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete issue report');
        }
    }
);