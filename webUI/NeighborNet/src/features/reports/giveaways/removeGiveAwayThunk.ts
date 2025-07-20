import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { GiveAwayId } from "./types";

// createAsyncThunk uses generic type parameters <ReturnType, ArgType>
export const removeGiveAwayThunk = createAsyncThunk<GiveAwayId, GiveAwayId>(
    'giveAways/remove',
    async (giveAwayId, { rejectWithValue }) => {
        try {
            await del(
                `${BASE_URL}/give-aways/${giveAwayId}`,
                { credentials: 'include' }
            );
            
            return giveAwayId;
            
        } catch (error) {
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to delete give-away';
            return rejectWithValue(errorMessage);
        }
    }
);