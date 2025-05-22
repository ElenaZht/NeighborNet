import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";

export const addHelpRequest = createAsyncThunk(
    'helpRequests/add',
    async (helpRequestData, { rejectWithValue }) => {
        try {
            const response = await post(`${import.meta.env.VITE_DEV_BASE_URL}/help-request`, 
                helpRequestData,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.helpRequest) {
                throw new Error('Invalid response from server');
            }

            return response;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create help request');
        }
    }
);