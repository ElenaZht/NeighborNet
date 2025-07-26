import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { UpdateStatusPayload, UpdateStatusResponse } from "./types";


export const updateIssueReportStatus = createAsyncThunk<
    UpdateStatusResponse,
    UpdateStatusPayload,
    { rejectValue: string }
>(
    'issueReports/updateStatus',
    async ({ reportId, newStatus }, { rejectWithValue }) => {
        try {
            const response = await patch(
                `${BASE_URL}/issue-reports/${reportId}/status`,
                { status: newStatus },
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.updatedReport) {
                throw new Error('Invalid response from server');
            }

            return {
                reportId,
                newStatus,
                updatedReport: response.updatedReport
            };
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update issue report status');
        }
    }
);