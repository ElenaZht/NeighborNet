import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { IssueReport, UpdateIssueReportPayload } from "./types";

/**
 * Edit issue report payload type
 */
interface EditIssueReportArg {
    reportId: number;
    issueReportData: Partial<UpdateIssueReportPayload>;
}

/**
 * Thunk to edit an existing issue report
 */
export const editIssueReport = createAsyncThunk<
    IssueReport,
    EditIssueReportArg,
    { rejectValue: string }
>(
    'issueReports/edit',
    async ({ reportId, issueReportData }, { rejectWithValue }) => {
        try {
            const response = await patch(
                `${BASE_URL}/issue-reports/${reportId}`,
                issueReportData,
                { credentials: 'include' }
            );
            
            if (!response || !response.editedReport) {
                throw new Error('Invalid response from server');
            }

            return response.editedReport;
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update issue report');
        }
    }
);