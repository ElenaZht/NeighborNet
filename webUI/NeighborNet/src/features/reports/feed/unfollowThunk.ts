import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { FollowReportParams } from "./types";
import { RootState } from "../../../store/store";
import { refreshFeed } from "./refreshFeedThunk";

export const unfollowReport = createAsyncThunk(
    'feed/unfollowReport',
    async ({ reportType, reportId }: FollowReportParams, { dispatch, getState, rejectWithValue }) => {
        const { feed } = getState() as RootState;

        // Optimistically remove the report from the feed
        const updatedFeedItems = feed.feedItems.filter(item => item.id !== parseInt(reportId));
        dispatch({ type: 'feed/setFeedItems', payload: updatedFeedItems });

        try {
            const response = await del(
                `${BASE_URL}/followers/${reportType}/${reportId}`,
                { credentials: 'include' } // Include cookies for authentication
            );

            // Remove the unfollowed report from the feed directly
            dispatch({
                type: 'feed/unfollowReportFulfilled',
                payload: { reportType, reportId }
            });

            // Refresh the feed to reflect the changes
            dispatch(refreshFeed());

            return {
                reportType,
                reportId,
                message: response.message
            };

        } catch (error) {
            // Revert the optimistic update if the request fails
            dispatch({ type: 'feed/setFeedItems', payload: feed.feedItems });

            // Ensure error is typed correctly
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            return rejectWithValue(errorMessage);
        }
    }
);