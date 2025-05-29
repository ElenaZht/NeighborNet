import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

export const getGiveAway = createAsyncThunk(
    'giveAways/getById',
    async (reportId, { rejectWithValue }) => {
        try {
            // The backend route structure is /give-aways/:reportId
            const response = await get(
                `${BASE_URL}/give-aways/${reportId}`,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.report) {
                throw new Error('Invalid response from server');
            }
            
            return response.report; // The controller returns { message, report }
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch give-away');
        }
    }
);