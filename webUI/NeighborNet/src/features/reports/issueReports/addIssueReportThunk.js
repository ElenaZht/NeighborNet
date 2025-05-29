import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";

export const addIssueReport = createAsyncThunk(
    'issueReports/add',
    async (reportData, { rejectWithValue }) => {
        try {
            const response = await post(`${import.meta.env.VITE_DEV_BASE_URL}/issue-reports`, 
                reportData,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.report) {
                throw new Error('Invalid response from server');
            }

            return response;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create issue report');
        }
    }
);