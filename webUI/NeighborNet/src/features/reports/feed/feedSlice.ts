import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllReports } from './getAllReportsThunk';
import { followReport } from './followThunk';
import { unfollowReport } from './unfollowThunk';
import { getNeighborhoodById } from '../../neighborhoods/getNeighborhoodThunk';
import { updateGiveAwayStatus } from '../giveaways/updateGiveAwayStatusThunk';
import { updateHelpRequestStatus } from '../helpRequests/updateHelpRequestStatusThunk';
import { updateOfferHelpStatus } from '../offerhelp/updateOfferHelpStatusThunk';
import { updateIssueReportStatus } from '../issueReports/updateIssueReportStatusThunk';
import { areaFilters, categoryFilters, orderOptions, allOwnFollowed } from '../../../../../../filters';
import { refreshFeed } from './refreshFeedThunk.js';
import { FeedState as OriginalFeedState } from './types';

// Extend the Filters type to include the _initialized property
interface ExtendedFilters {
    areaFilter: string;
    categoryFilter: string[];
    order: string;
    allOwnFollowed: string;
    _initialized?: boolean;
}

// Extend the FeedState type to use ExtendedFilters
interface FeedState extends Omit<OriginalFeedState, 'filters'> {
    filters: ExtendedFilters;
}

const savedFilters = localStorage.getItem('feedFilters');

const initialState: FeedState = {
    feedItems: [],
    loading: false,
    error: null,
    status: '',
    neighborhood: null,
    neighborhoodLoading: false,
    pagination: {
        limit: 10,
        offset: 0,
        hasMore: true
    },
    filters: savedFilters ? { ...JSON.parse(savedFilters), _initialized: true } : {
        areaFilter: areaFilters.includes('NBR') ? 'NBR' : 'CITY',
        categoryFilter: categoryFilters,
        order: orderOptions[0],
        allOwnFollowed: allOwnFollowed[0],
        _initialized: true,
    },
};

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        nextOffset: (state) => {
            state.pagination.offset += state.pagination.limit;
        },
        resetOffset: (state) => {
            state.pagination.offset = 0;
            state.pagination.hasMore = true;
        },
        setStoreFilters: (state, action: PayloadAction<ExtendedFilters>) => {
            const updatedFilters = action.payload;
            state.filters = { ...updatedFilters, _initialized: true };
            // Persist filters to localStorage
            localStorage.setItem('feedFilters', JSON.stringify(state.filters));
        },
        clearFeed: (state) => {
            state.feedItems = [];
        },
        updateReportStatus: (state, action) => {
            const { reportId, reportType, newStatus } = action.payload;
            const report = state.feedItems.find(item => 
                Number(item.id) === Number(reportId) && item.record_type === reportType
            );
            if (report) {
                report.status = newStatus;
            }
        },
        reloadFiltersFromLocalStorage: (state) => {

            if (state.filters._initialized) {
                return;
            }

            const savedFilters = localStorage.getItem('feedFilters');

            if (savedFilters) {
                try {
                    const parsedFilters = JSON.parse(savedFilters);

                    // Validate areaFilter
                    if (!['COUNTRY', 'CITY', 'NBR'].includes(parsedFilters.areaFilter)) {
                        parsedFilters.areaFilter = areaFilters.includes('NBR') ? 'NBR' : 'CITY'; // Default to NBR, fallback to CITY
                    }

                    // Only update state if filters have changed
                    if (JSON.stringify(state.filters) !== JSON.stringify(parsedFilters)) {
                        state.filters = { ...parsedFilters, _initialized: true };
                    }
                } catch (error) {
                    console.error('Failed to parse saved filters from localStorage:', error);
                }
            } else {
                state.filters = {
                    areaFilter: areaFilters.includes('NBR') ? 'NBR' : 'CITY',
                    categoryFilter: categoryFilters,
                    order: orderOptions[0],
                    allOwnFollowed: allOwnFollowed[0],
                    _initialized: true,
                };
            }
        },
        applyFilters: (state) => {

            // Check if filters are valid before saving
            if (!state.filters || typeof state.filters !== 'object') {
                return;
            }


            // Persist the updated filters to localStorage
            try {
                localStorage.setItem('feedFilters', JSON.stringify(state.filters));
            } catch (error) {
                console.error('Failed to save filters to localStorage:', error); // Debugging log
            }
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        initializeFilters: (state) => {
            const savedFilters = localStorage.getItem('feedFilters');
            if (savedFilters) {
                try {
                    const parsedFilters = JSON.parse(savedFilters);
                    // Validate areaFilter
                    if (!['COUNTRY', 'CITY', 'NBR'].includes(parsedFilters.areaFilter)) {
                        parsedFilters.areaFilter = areaFilters.includes('NBR') ? 'NBR' : 'CITY'; // Default to NBR, fallback to CITY
                    }
                    state.filters = parsedFilters;
                } catch (error) {
                    console.error('Failed to parse saved filters from localStorage:', error);
                }
            }
        },
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
                if (action.payload.reports.length === 0 && state.feedItems.length > 0) {
                    state.pagination.hasMore = false;
                } else {
                    // Check if this is a fresh load (offset 0) or pagination
                    if (state.pagination.offset === 0) {
                        // Fresh load - replace all items
                        state.feedItems = action.payload.reports;
                    } else {
                        // Pagination - append new items
                        state.feedItems.push(...action.payload.reports);
                    }
                }
            })
            .addCase(getAllReports.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to fetch feed items';
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
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to follow report';
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
                // Remove the report from the feed if the 'Followed Reports' filter is active
                if (state.filters.allOwnFollowed === 'followed') {
                    state.feedItems = state.feedItems.filter(item => 
                        !(item.id === parseInt(reportId) && item.record_type === reportType)
                    );
                }
                state.error = null;
            })
            .addCase(unfollowReport.rejected, (state, action) => {
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to unfollow report';
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
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to fetch neighborhood';
            })
            
            // Handle status updates without refetching
            .addCase(updateGiveAwayStatus.fulfilled, (state, action) => {
                const { reportId, newStatus } = action.payload;
                const report = state.feedItems.find(item => 
                    Number(item.id) === Number(reportId) && item.record_type === 'give_away'
                );
                if (report) {
                    report.status = newStatus;
                }
            })
            .addCase(updateHelpRequestStatus.fulfilled, (state, action) => {
                const { reportId, newStatus } = action.payload;
                const report = state.feedItems.find(item => 
                    Number(item.id) === Number(reportId) && item.record_type === 'help_request'
                );
                if (report) {
                    report.status = newStatus;
                }
            })
            .addCase(updateOfferHelpStatus.fulfilled, (state, action) => {
                const { reportId, newStatus } = action.payload;
                const report = state.feedItems.find(item => 
                    item.id === reportId && item.record_type === 'offer_help'
                );
                if (report) {
                    report.status = newStatus;
                }
            })
            .addCase(updateIssueReportStatus.fulfilled, (state, action) => {
                const { reportId, newStatus } = action.payload;
                const report = state.feedItems.find(item => 
                    item.id === reportId && item.record_type === 'issue_report'
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
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to refresh feed';
            });
    },
});

export const {nextOffset, resetOffset, setStoreFilters, clearFeed, updateReportStatus, reloadFiltersFromLocalStorage, applyFilters, setError, initializeFilters} = feedSlice.actions;
export default feedSlice.reducer;