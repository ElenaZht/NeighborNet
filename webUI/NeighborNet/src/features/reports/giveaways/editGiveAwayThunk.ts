import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { EditGiveAwayParams, GiveAwayResponse } from "./types";

export const editGiveAway = createAsyncThunk<GiveAwayResponse, EditGiveAwayParams>(
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
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to update give-away';
            return rejectWithValue(errorMessage);
        }
    }
);