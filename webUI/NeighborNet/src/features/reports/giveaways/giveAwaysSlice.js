import { createSlice } from '@reduxjs/toolkit';
import { addGiveAway } from './addGiveAwayThunk';
import { getGiveAway } from './getGiveAwayThunk';


const initialState = {
    allGiveAways: [],
    currentGiveAway: null,
    loading: false,
    error: null,
    status: ''
}

const giveAwaysSlice = createSlice({
    name: 'give-aways',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add Give Away
            .addCase(addGiveAway.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addGiveAway.fulfilled, (state, action) => {
                state.loading = false;
                // Add new give-away to the beginning of the array
                state.allGiveAways.unshift(action.payload.giveAway);
                state.error = null;
            })
            .addCase(addGiveAway.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create give-away listing';
            })

            // Get Single Give Away
            .addCase(getGiveAway.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGiveAway.fulfilled, (state, action) => {
                state.loading = false;
                state.currentGiveAway = action.payload;
                state.error = null;
            })
            .addCase(getGiveAway.rejected, (state, action) => {
                state.loading = false;
                state.currentGiveAway = null;
                state.error = action.payload || 'Failed to fetch give-away';
            })
    }
})

export default giveAwaysSlice.reducer;