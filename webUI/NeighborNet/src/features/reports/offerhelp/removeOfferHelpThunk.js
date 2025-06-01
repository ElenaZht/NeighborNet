import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from "../../../utils/apiClient";

export const removeOfferHelp = createAsyncThunk(
    'offerHelp/remove',
    async (reportId, { rejectWithValue }) => {
        try {
            const response = await del(`${import.meta.env.VITE_DEV_BASE_URL}/offer-help/${reportId}`, 
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response) {
                throw new Error('Invalid response from server');
            }

            return reportId; // Return the ID of the deleted report
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete offer help report');
        }
    }
);