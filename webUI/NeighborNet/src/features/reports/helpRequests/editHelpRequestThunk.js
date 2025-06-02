import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

export const editHelpRequest = createAsyncThunk(
    'helpRequests/edit',
    async ({ reportId, helpRequestData }, { rejectWithValue }) => {
        try {
            const response = await patch(
                `${BASE_URL}/help-requests/${reportId}`,
                helpRequestData,
                { credentials: 'include' } // cookies for authentication
            );
            
            if (!response || !response.updatedReport) {
                throw new Error('Invalid response from server');
            }

            return response.updatedReport;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update help request');
        }
    }
);