import { createSlice } from '@reduxjs/toolkit';
import { addOfferHelp } from './addOfferHeplThunk';

const initialState = {
    allOfferHelp: [],
    loading: false,
    error: null
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
    }
})

export default offerHelpSlice.reducer;