import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

interface GetCommentsParams {
  reportType: string;
  reportId: number;
}

export const getComments = createAsyncThunk(
    'comments/getByReport',
    async ({ reportType, reportId }: GetCommentsParams, { rejectWithValue }) => {
        try {
            // The backend route structure is /comments/:reportType/:reportId
            const response = await get(
                `${BASE_URL}/comments/${reportType}/${reportId}`,
                { credentials: 'include' } // Include cookies for authentication
            );
            return response.comments; // The controller returns { message, comments }
            
        } catch (error) {
            return rejectWithValue((error as Error).message || 'Failed to fetch comments');
        }
    }
);