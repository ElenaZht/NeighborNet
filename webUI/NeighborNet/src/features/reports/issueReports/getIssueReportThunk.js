import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

export const getIssueReport = createAsyncThunk(
    'issueReports/getById',
    async (reportId, { rejectWithValue }) => {
        try {
            // The backend route structure is /issue-reports/:reportId
            const response = await get(
                `${BASE_URL}/issue-reports/${reportId}`,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.report) {
                throw new Error('Invalid response from server');
            }
            
            return response.report; // The controller returns { message, report }
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch issue report');
        }
    }
);