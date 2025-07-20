import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { FollowReportParams } from "./types";

export const unfollowReport = createAsyncThunk(
    'feed/unfollowReport',
    async ({ reportType, reportId }: FollowReportParams, { rejectWithValue }) => {
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
            return rejectWithValue((error as Error).message || 'Failed to unfollow report');
        }
    }
);