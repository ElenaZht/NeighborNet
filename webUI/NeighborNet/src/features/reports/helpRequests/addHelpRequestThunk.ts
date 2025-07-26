import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { CreateHelpRequestPayload, HelpRequestResponse } from "./types";

export const addHelpRequest = createAsyncThunk<
    HelpRequestResponse, 
    CreateHelpRequestPayload, 
    { rejectValue: string }
>(
    'helpRequests/add',
    async (helpRequestData, { rejectWithValue }) => {
        try {
            const response = await post(`${BASE_URL}/help-requests`, 
                helpRequestData,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.helpRequest) {
                throw new Error('Invalid response from server');
            }

            return response;
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create help request');
        }
    }
);