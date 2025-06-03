import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

export const editIssueReport = createAsyncThunk(
    'issueReports/edit',
    async ({ reportId, issueReportData }, { rejectWithValue }) => {
        try {
            const response = await patch(
                `${BASE_URL}/issue-reports/${reportId}`,
                issueReportData,
                { credentials: 'include' }
            );
            
            if (!response || !response.updatedReport) {
                throw new Error('Invalid response from server');
            }

            return response.updatedReport;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update issue report');
        }
    }
);