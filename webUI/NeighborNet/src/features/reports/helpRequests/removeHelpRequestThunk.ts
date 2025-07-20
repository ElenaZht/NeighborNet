import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";


export const removeHelpRequest = createAsyncThunk<
    number, // Return type is the ID of the removed help request
    number, // Argument type is the ID of the help request to remove
    { rejectValue: string }
>(
    'helpRequest/remove',
    async (helpRequestId, { rejectWithValue }) => {
        try {
            await del(
                `${BASE_URL}/help-requests/${helpRequestId}`,
                { credentials: 'include' }
            );

            return helpRequestId;
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete help-request');
        }
    }
);