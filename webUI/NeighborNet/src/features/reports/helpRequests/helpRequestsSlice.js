import { createSlice } from '@reduxjs/toolkit';
import { addHelpRequest } from './addHelpRequestThunk';
import { getHelpRequest } from './getHelpRequestThunk';
import { removeHelpRequest} from './removeHelpRequestThunk';


const initialState = {
    allHelpRequests: [],
    loading: false,
    error: null,
    status: ''
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
            

            // Remove Help Request
            .addCase(removeHelpRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeHelpRequest.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted help request from the array
                state.allHelpRequests = state.allHelpRequests.filter(
                    helpRequest => helpRequest.id !== action.payload
                );

                state.error = null;
            })
            .addCase(removeHelpRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete help request';
            })
    }
})

export default helpRequestsSlice.reducer;