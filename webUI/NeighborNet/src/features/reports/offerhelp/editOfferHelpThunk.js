import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

export const editOfferHelp = createAsyncThunk(
    'offerHelp/edit',
    async ({ reportId, offerHelpData }, { rejectWithValue }) => {
        try {
            const response = await patch(
                `${BASE_URL}/offer-help/${reportId}`,
                offerHelpData,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.updatedReport) {
                throw new Error('Invalid response from server');
            }

            return {
                reportId,
                updatedReport: response.updatedReport
            };
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update offer help');
        }
    }
);