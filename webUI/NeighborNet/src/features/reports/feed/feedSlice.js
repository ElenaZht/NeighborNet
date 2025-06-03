import { createSlice } from '@reduxjs/toolkit';
import { getAllReports } from './getAllReportsThunk.js';
import { followReport } from './followThunk.js';
import { unfollowReport } from './unfollowThunk.js';
import { getNeighborhoodById } from '../../neighborhoods/getNeighborhoodThunk';
import { updateGiveAwayStatus } from '../giveaways/updateGiveAwayStatusThunk.js';
import { updateHelpRequestStatus } from '../helpRequests/updateHelpRequestStatusThunk.js';
import { updateOfferHelpStatus } from '../offerhelp/updateOfferHelpStatusThunk.js';
import { updateIssueReportStatus } from '../issueReports/updateIssueReportStatusThunk.js';
import {areaFilters, categoryFilters, orderOptions, allOwnFollowed} from '../../../../../../filters.js'
import { refreshFeed } from './refreshFeedThunk.js';


const initialState = {
    feedItems: [],
    loading: false,
    error: null,
    status: '',
    neighborhood: {},
    neighborhoodLoading: false,
    pagination: {
        limit: 10,
        offset: 0,
        hasMore: true
    },
    filters: {
        areaFilter: areaFilters[2],
        categoryFilter: categoryFilters,
        order: orderOptions[0],
        allOwnFollowed: allOwnFollowed[0],
    }
};

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        nextOffset: (state) => {
            state.pagination.offset += state.pagination.limit
        },
        resetOffset: (state) => {
            state.pagination.offset = 0
            state.hasMore = true
        },
        setStoreFilters: (state, action) => {
            state.filters = action.payload
        },
        clearFeed: (state) => {
            state.feedItems = []
        },
        updateReportStatus: (state, action) => {
            const { reportId, reportType, newStatus } = action.payload;
            const report = state.feedItems.find(item => 
                item.id === parseInt(reportId) && item.record_type === reportType
            );
            if (report) {
                report.status = newStatus;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Feed reports
            .addCase(getAllReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllReports.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.reports.length == 0 && state.feedItems.length > 0){
                    state.pagination.hasMore = false;
                } 
                else {
                    // Check if this is a fresh load (offset 0) or pagination
                    if (state.pagination.offset === 0) {
                        // Fresh load - replace all items
                        state.feedItems = action.payload.reports;
                    } else {
                        // Pagination - append new items
                        state.feedItems.push(...action.payload.reports);
                    }
                }
                state.error = null;
            })
            .addCase(getAllReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch feed items';
            })
            
            // Follow Report
            .addCase(followReport.pending, (state) => {
                state.error = null;
            })
            .addCase(followReport.fulfilled, (state, action) => {
                const { reportType, reportId } = action.payload;
                // Update the isFollowed status and increment followers count
                const report = state.feedItems.find(item => 
                    item.id === parseInt(reportId) && item.record_type === reportType
                );
                if (report) {
                    report.isFollowed = true;
                    report.followers = (report.followers || 0) + 1;
                }
                state.error = null;
            })
            .addCase(followReport.rejected, (state, action) => {
                state.error = action.payload || 'Failed to follow report';
            })
            
            // Unfollow Report
            .addCase(unfollowReport.pending, (state) => {
                state.error = null;
            })
            .addCase(unfollowReport.fulfilled, (state, action) => {
                const { reportType, reportId } = action.payload;
                // Update the isFollowed status and decrement followers count
                const report = state.feedItems.find(item => 
                    item.id === parseInt(reportId) && item.record_type === reportType
                );
                if (report) {
                    report.isFollowed = false;
                    report.followers = Math.max((report.followers || 1) - 1, 0);
                }
                state.error = null;
            })
            .addCase(unfollowReport.rejected, (state, action) => {
                state.error = action.payload || 'Failed to unfollow report';
            })
            
            // Get Neighborhood By ID
            .addCase(getNeighborhoodById.pending, (state) => {
                state.neighborhoodLoading = true; // Use separate loading state
                state.error = null;
            })
            .addCase(getNeighborhoodById.fulfilled, (state, action) => {
                state.neighborhoodLoading = false;
                state.neighborhood = action.payload;
                state.error = null;
            })
            .addCase(getNeighborhoodById.rejected, (state, action) => {
                state.neighborhoodLoading = false;
                state.error = action.payload || 'Failed to fetch neighborhood';
            })
            
            // Handle status updates without refetching
            .addCase(updateGiveAwayStatus.fulfilled, (state, action) => {
                const { reportId, newStatus } = action.payload;
                const report = state.feedItems.find(item => 
                    item.id === parseInt(reportId) && item.record_type === 'give_away'
                );
                if (report) {
                    report.status = newStatus;
                }
            })
            .addCase(updateHelpRequestStatus.fulfilled, (state, action) => {
                const { reportId, newStatus } = action.payload;
                const report = state.feedItems.find(item => 
                    item.id === parseInt(reportId) && item.record_type === 'help_request'
                );
                if (report) {
                    report.status = newStatus;
                }
            })
            .addCase(updateOfferHelpStatus.fulfilled, (state, action) => {
                const { reportId, newStatus } = action.payload;
                const report = state.feedItems.find(item => 
                    item.id === parseInt(reportId) && item.record_type === 'offer_help'
                );
                if (report) {
                    report.status = newStatus;
                }
            })
            .addCase(updateIssueReportStatus.fulfilled, (state, action) => {
                const { reportId, newStatus } = action.payload;
                const report = state.feedItems.find(item => 
                    item.id === parseInt(reportId) && item.record_type === 'issue_report'
                );
                if (report) {
                    report.status = newStatus;
                }
            })
            .addCase(refreshFeed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshFeed.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(refreshFeed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to refresh feed';
            });
    },
});

export const {nextOffset, resetOffset, setStoreFilters, clearFeed, updateReportStatus} = feedSlice.actions;
export default feedSlice.reducer;