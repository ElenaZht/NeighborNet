import { createSlice } from '@reduxjs/toolkit';
import { addIssueReport } from './addIssueReportThunk';
import { getIssueReport } from './getIssueReportThunk';

const initialState = {
    allIssueReports: [],
    currentIssueReport: null,
    loading: false,
    error: null
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

            // Get Single Issue Report
            .addCase(getIssueReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getIssueReport.fulfilled, (state, action) => {
                state.loading = false;
                state.currentIssueReport = action.payload;
                state.error = null;
            })
            .addCase(getIssueReport.rejected, (state, action) => {
                state.loading = false;
                state.currentIssueReport = null;
                state.error = action.payload || 'Failed to fetch issue report';
            })
    }
})

export default issueReportsSlice.reducer;