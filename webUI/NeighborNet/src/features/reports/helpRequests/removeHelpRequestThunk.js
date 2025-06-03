import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

export const removeHelpRequest = createAsyncThunk(
    'helpRequest/remove',
    async (helpRequestId, { rejectWithValue }) => {
        try {
            await del(
                `${BASE_URL}/help-requests/${helpRequestId}`,
                { credentials: 'include' }
            );

            return helpRequestId;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete help-request');
        }
    }
);