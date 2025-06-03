import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

export const updateHelpRequestStatus = createAsyncThunk(
    'helpRequests/updateStatus',
    async ({ reportId, newStatus }, { rejectWithValue }) => {
        try {
            const response = await patch(
                `${BASE_URL}/help-requests/${reportId}/status`,
                { newStatus },
                { credentials: 'include' }
            );
            
            if (!response || !response.report) {
                throw new Error('Invalid response from server');
            }

            return {
                reportId,
                newStatus,
                updatedReport: response.report
            };
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update help request status');
        }
    }
);