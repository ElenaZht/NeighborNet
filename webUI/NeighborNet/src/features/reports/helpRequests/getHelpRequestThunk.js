import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

export const getHelpRequest = createAsyncThunk(
    'helpRequests/getById',
    async (reportId, { rejectWithValue }) => {
        try {
            // The backend route structure is /help-requests/:reportId
            const response = await get(
                `${BASE_URL}/help-requests/${reportId}`,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            return response.report; // The controller returns { message, report }
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch help request');
        }
    }
);