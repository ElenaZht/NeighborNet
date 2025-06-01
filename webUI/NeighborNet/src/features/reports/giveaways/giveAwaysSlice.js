import { createSlice } from '@reduxjs/toolkit';
import { addGiveAway } from './addGiveAwayThunk';
import { removeGiveAwayThunk } from './removeGiveAwayThunk';


const initialState = {
    allGiveAways: [],
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

            // Remove Give Away
            .addCase(removeGiveAwayThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeGiveAwayThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted giveaway from the array using the returned ID
                state.allGiveAways = state.allGiveAways.filter(
                    giveAway => giveAway.id !== action.payload
                );
                // Clear currentGiveAway if it was the deleted one
                if (state.currentGiveAway && state.currentGiveAway.id === action.payload) {
                    state.currentGiveAway = null;
                }
                state.error = null;
            })
            .addCase(removeGiveAwayThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete give-away';
            })
    }
})

export default giveAwaysSlice.reducer;