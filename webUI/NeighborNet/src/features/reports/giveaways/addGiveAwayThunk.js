import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";

export const addGiveAway = createAsyncThunk(
    'giveAways/add',
    async (giveAwayData, { rejectWithValue }) => {
        try {
            const response = await post(`${import.meta.env.VITE_DEV_BASE_URL}/give-aways`, 
                giveAwayData,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.giveAway) {
                throw new Error('Invalid response from server');
            }

            return response;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create give-away listing');
        }
    }
);