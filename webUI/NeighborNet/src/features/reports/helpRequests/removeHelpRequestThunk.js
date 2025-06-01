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
            
            // The server returns { message, deletedReport } or just an empty object for 204
            // We just need to return the helpRequest for the slice to filter it out
            return helpRequestId;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete help-request');
        }
    }
);