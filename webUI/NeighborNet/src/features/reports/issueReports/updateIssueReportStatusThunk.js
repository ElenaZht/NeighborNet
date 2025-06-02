import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

export const updateIssueReportStatus = createAsyncThunk(
    'issueReports/updateStatus',
    async ({ reportId, newStatus }, { rejectWithValue }) => {
        try {
            const response = await patch(
                `${BASE_URL}/issue-reports/${reportId}/status`,
                { newStatus },
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.report) {
                throw new Error('Invalid response from server');
            }

            return {
                reportId,
                newStatus,
                updatedReport: response.report
            };
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update issue report status');
        }
    }
);