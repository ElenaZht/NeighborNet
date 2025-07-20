import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

interface UpdateGiveAwayStatusParams {
    reportId: string;
    newStatus: string;
}

export const updateGiveAwayStatus = createAsyncThunk(
    'giveAways/updateStatus',
    async ({ reportId, newStatus }: UpdateGiveAwayStatusParams, { rejectWithValue }) => {
        try {
            const response = await patch(
                `${BASE_URL}/give-aways/${reportId}/status`,
                { newStatus },
                { credentials: 'include' } // Include cookies for authentication
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
            return rejectWithValue((error as Error).message || 'Failed to update give-away status');
        }
    }
);