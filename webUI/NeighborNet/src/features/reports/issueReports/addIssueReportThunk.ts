import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { CreateIssueReportPayload, IssueReportResponse } from "./types";


export const addIssueReport = createAsyncThunk<
    IssueReportResponse,
    CreateIssueReportPayload,
    { rejectValue: string }
>(
    'issueReports/add',
    async (reportData, { rejectWithValue }) => {
        try {
            const response = await post(`${BASE_URL}/issue-reports`, 
                reportData,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.report) {
                throw new Error('Invalid response from server');
            }

            return response;
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create issue report');
        }
    }
);