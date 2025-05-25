import { createSlice } from '@reduxjs/toolkit';
import { addHelpRequest } from './addHelpRequestThunk';
import { getHelpRequest } from './getHelpRequestThunk';


const initialState = {
    allHelpRequests: [],
    currentHelpRequest: null,
    loading: false,
    error: null
}

const helpRequestsSlice = createSlice({
    name: 'help-requests',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add Help Request
            .addCase(addHelpRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addHelpRequest.fulfilled, (state, action) => {
                state.loading = false;
                // Add new help request to the beginning of the array
                state.allHelpRequests.unshift(action.payload.helpRequest);
                state.error = null;
            })
            .addCase(addHelpRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create help request';
            })
            
            // Get Help Request by ID
            .addCase(getHelpRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getHelpRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.currentHelpRequest = action.payload;
                state.error = null;
            })
            .addCase(getHelpRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch help request';
            })
    }
})

export default helpRequestsSlice.reducer;