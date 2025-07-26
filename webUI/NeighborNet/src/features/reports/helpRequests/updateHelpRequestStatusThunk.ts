import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { UpdateStatusPayload, UpdateStatusResponse } from "./types";

export const updateHelpRequestStatus = createAsyncThunk<
    UpdateStatusResponse,
    UpdateStatusPayload,
    { rejectValue: string }
>(
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
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update help request status');
        }
    }
);