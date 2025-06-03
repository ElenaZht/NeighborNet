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
            
            return giveAwayId;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete give-away');
        }
    }
);