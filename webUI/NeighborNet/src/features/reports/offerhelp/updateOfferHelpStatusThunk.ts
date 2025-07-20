import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { UpdateStatusPayload, UpdateStatusResponse } from "./types";

/**
 * Thunk to update the status of an offer help
 */
export const updateOfferHelpStatus = createAsyncThunk<
    UpdateStatusResponse,
    UpdateStatusPayload,
    { rejectValue: string }
>(
    'offerHelp/updateStatus',
    async ({ reportId, newStatus }, { rejectWithValue }) => {
        try {
            const response = await patch(
                `${BASE_URL}/offer-help/${reportId}/status`,
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
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update offer help status');
        }
    }
);