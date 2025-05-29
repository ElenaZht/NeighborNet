import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

export const getOfferHelp = createAsyncThunk(
    'offerHelp/getById',
    async (reportId, { rejectWithValue }) => {
        try {
            // The backend route structure is /offer-help/:reportId
            const response = await get(
                `${BASE_URL}/offer-help/${reportId}`,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.report) {
                throw new Error('Invalid response from server');
            }
            
            return response.report; // The controller returns { message, report }
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch help offer');
        }
    }
);