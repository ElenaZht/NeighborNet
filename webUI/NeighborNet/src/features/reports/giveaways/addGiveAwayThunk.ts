import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";
import { AddGiveAwayData, GiveAwayResponse } from "./types";

export const addGiveAway = createAsyncThunk<GiveAwayResponse, AddGiveAwayData>(
    'giveAways/add',
    async (giveAwayData, { rejectWithValue }) => {
        try {
            const response = await post(`${(import.meta as any).env.VITE_DEV_BASE_URL}/give-aways`, 
                giveAwayData,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.giveAway) {
                throw new Error('Invalid response from server');
            }

            return response;
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create give-away listing');
        }
    }
);