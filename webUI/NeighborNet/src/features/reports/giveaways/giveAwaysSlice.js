import { createSlice } from '@reduxjs/toolkit';
import { addGiveAway } from './addGiveAwayThunk';

const initialState = {
    allGiveAways: [],
    loading: false,
    error: null
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
    }
})

export default giveAwaysSlice.reducer;