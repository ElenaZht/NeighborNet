import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

export const editGiveAway = createAsyncThunk(
    'giveAways/edit',
    async ({ reportId, giveAwayData }, { rejectWithValue }) => {
        try {
            const response = await patch(
                `${BASE_URL}/give-aways/${reportId}`,
                giveAwayData,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.updatedReport) {
                throw new Error('Invalid response from server');
            }

            return response;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update give-away');
        }
    }
);