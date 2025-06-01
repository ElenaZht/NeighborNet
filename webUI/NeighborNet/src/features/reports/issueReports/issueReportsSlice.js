import { createSlice } from '@reduxjs/toolkit';
import { addIssueReport } from './addIssueReportThunk';
import { getIssueReport } from './getIssueReportThunk';
import { removeIssueReport } from './removeIssueReportThunk';

const initialState = {
    allIssueReports: [],
    loading: false,
    error: null,
    status: ''
}

const issueReportsSlice = createSlice({
    name: 'issue-reports',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add Issue Report
            .addCase(addIssueReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addIssueReport.fulfilled, (state, action) => {
                state.loading = false;
                // Add new report to the beginning of the array
                state.allIssueReports.unshift(action.payload.report);
                state.error = null;
            })
            .addCase(addIssueReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create issue report';
            })

            // Remove Issue Report
            .addCase(removeIssueReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeIssueReport.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted issue report from the array using the returned ID
                state.allIssueReports = state.allIssueReports.filter(
                    report => report.id !== action.payload
                );
                state.error = null;
            })
            .addCase(removeIssueReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete issue report';
            })
    }
})

export default issueReportsSlice.reducer;