import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { HelpRequest, UpdateHelpRequestPayload } from "./types";

interface EditHelpRequestArg {
    reportId: number;
    helpRequestData: Partial<UpdateHelpRequestPayload>;
}

export const editHelpRequest = createAsyncThunk<
    HelpRequest,
    EditHelpRequestArg,
    { rejectValue: string }
>(
    'helpRequests/edit',
    async ({ reportId, helpRequestData }, { rejectWithValue }) => {
        try {
            const response = await patch(
                `${BASE_URL}/help-requests/${reportId}`,
                helpRequestData,
                { credentials: 'include' } // cookies for authentication
            );
            
            if (!response || !response.updatedReport) {
                throw new Error('Invalid response from server');
            }

            return response.updatedReport;
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update help request');
        }
    }
);