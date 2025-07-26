import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from "../../../utils/apiClient";

interface RemoveIssueReportArgs {
    reportId: string;
}

export const removeIssueReport = createAsyncThunk<
    string, // Return type (reportId)
    RemoveIssueReportArgs, // Argument type
    { rejectValue: string } // Rejected value type
>(
    'issueReports/remove',
    async ({ reportId }, { rejectWithValue }) => {
        try {
            const response = await del(`${import.meta.env.VITE_DEV_BASE_URL}/issue-reports/${reportId}`, 
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response) {
                throw new Error('Invalid response from server');
            }

            return reportId; // Return the ID of the deleted report
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete issue report';
            return rejectWithValue(errorMessage);
        }
    }
);