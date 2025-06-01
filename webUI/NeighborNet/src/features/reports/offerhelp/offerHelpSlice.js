import { createSlice } from '@reduxjs/toolkit';
import { addOfferHelp } from './addOfferHeplThunk';
import { getOfferHelp } from './getOfferHelpThunk';
import { removeOfferHelp } from './removeOfferHelpThunk';

const initialState = {
    allOfferHelp: [],
    loading: false,
    error: null,
    status: ''
}

const offerHelpSlice = createSlice({
    name: 'offer-help',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add Offer Help
            .addCase(addOfferHelp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addOfferHelp.fulfilled, (state, action) => {
                state.loading = false;
                // Add new offer help to the beginning of the array
                state.allOfferHelp.unshift(action.payload.offerHelp);
                state.error = null;
            })
            .addCase(addOfferHelp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create help offer';
            })
            

            // Remove Offer Help
            .addCase(removeOfferHelp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeOfferHelp.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted offer help from the array using the returned ID
                state.allOfferHelp = state.allOfferHelp.filter(
                    offerHelp => offerHelp.id !== action.payload
                );

                state.error = null;
            })
            .addCase(removeOfferHelp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete offer help';
            })
    }
})

export default offerHelpSlice.reducer;