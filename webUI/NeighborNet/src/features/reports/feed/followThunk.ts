import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";
import { FollowReportParams } from "./types";

export const followReport = createAsyncThunk(
    'feed/followReport',
    async ({ reportType, reportId }: FollowReportParams, { rejectWithValue }) => {
        try {
            const response = await post(
                `${BASE_URL}/followers/${reportType}/${reportId}`,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            return {
                reportType,
                reportId,
                message: response.message
            };
            
        } catch (error) {
            return rejectWithValue((error as Error).message || 'Failed to follow report');
        }
    }
);