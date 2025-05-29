import { createSlice } from '@reduxjs/toolkit';
import { getComments } from './getCommentsThunk';
import { addComment } from './addCommentThunk';

const initialState = {
    currentReport: {
        reportId: localStorage.getItem('currentReportId') || null,
        reportType: localStorage.getItem('currentReportType') || null
    },
    comments: localStorage.getItem('comments') ? JSON.parse(localStorage.getItem('comments')) : [],
    loading: false,
    error: null
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        setCurrentReport: (state, action) => {
            const { reportId, reportType } = action.payload;
            state.currentReport = { reportId, reportType };
            localStorage.setItem('currentReportId', reportId);
            localStorage.setItem('currentReportType', reportType);
            state.comments = []; // Clear comments when changing reports
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Comments
            .addCase(getComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
                localStorage.setItem('comments', JSON.stringify(action.payload));
            })
            .addCase(getComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Add Comment
            .addCase(addComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.loading = false;
                // Add new comment to the beginning of the array
                const newComment = action.payload.comment;
                state.comments = [newComment, ...state.comments];
                localStorage.setItem('comments', JSON.stringify(state.comments));
            })
            .addCase(addComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { setCurrentReport } = commentsSlice.actions;
export default commentsSlice.reducer;