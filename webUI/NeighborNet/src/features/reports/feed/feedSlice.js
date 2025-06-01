import { createSlice } from '@reduxjs/toolkit';
import { getAllReports } from './getAllReportsThunk';
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
    }
});

export const {nextOffset, resetOffset, setStoreFilters, clearFeed} = feedSlice.actions;
export default feedSlice.reducer;