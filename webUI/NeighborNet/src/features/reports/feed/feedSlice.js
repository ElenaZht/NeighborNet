import { createSlice } from '@reduxjs/toolkit';
import { getAllReports } from './getAllReportsThunk';
import { followReport } from './followThunk';
import { unfollowReport } from './unfollowThunk';
import { getNeighborhoodById } from '../../neighborhoods/getNeighborhoodThunk';


const areaFilters  = ['COUNTRY', 'CITY', 'NBR']
const categoryFilters = ['GIVEAWAY', 'OFFERHELP', 'HELPREQUEST', 'ISSUEREPORT']
const orderOptions = ['DATE', 'DISTANCE']
const allOwnFollowed = ['ALL', 'OWN', 'FOLLOWED']

const initialState = {
    feedItems: [],
    loading: false,
    error: null,
    status: '',
    neighborhood: {},
    neighborhoodLoading: false, // Separate loading state for neighborhood
    pagination: {
        limit: 10,
        offset: 0,
        hasMore: true
    },
    filters: {
        areaFilter: areaFilters[0],
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
                    state.feedItems.push(...action.payload.reports);
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

    },
});

export const {nextOffset, resetOffset, setStoreFilters, clearFeed} = feedSlice.actions;
export default feedSlice.reducer;