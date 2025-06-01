import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

// Remove follower (unfollow a report)
export const unfollowReport = createAsyncThunk(
    'feed/unfollowReport',
    async ({ reportType, reportId }, { rejectWithValue }) => {
        try {
            const response = await del(
                `${BASE_URL}/followers/${reportType}/${reportId}`,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            return {
                reportType,
                reportId,
                message: response.message
            };
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to unfollow report');
        }
    }
);