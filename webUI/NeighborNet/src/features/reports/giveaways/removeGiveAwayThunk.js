import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

export const removeGiveAwayThunk = createAsyncThunk(
    'giveAways/remove',
    async (giveAwayId, { rejectWithValue }) => {
        try {
            await del(
                `${BASE_URL}/give-aways/${giveAwayId}`,
                { credentials: 'include' }
            );
            
            // The server returns { message, deletedReport } or just an empty object for 204
            // We just need to return the giveAwayId for the slice to filter it out
            return giveAwayId;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete give-away');
        }
    }
);