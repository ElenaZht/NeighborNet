import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";

export const addOfferHelp = createAsyncThunk(
    'offerHelp/add',
    async (offerHelpData, { rejectWithValue }) => {
        try {
            const response = await post(`${import.meta.env.VITE_DEV_BASE_URL}/offer-help`, 
                offerHelpData,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.offerHelp) {
                throw new Error('Invalid response from server');
            }

            return response;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create help offer');
        }
    }
);