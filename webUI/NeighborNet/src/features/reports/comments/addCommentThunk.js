import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";

export const addComment = createAsyncThunk(
    'comments/add',
    async ({ reportType, reportId, content }, { rejectWithValue }) => {
        try {
            // The backend route structure is /comments/:reportType/:reportId
            const response = await post(
                `${BASE_URL}/comments/${reportType}/${reportId}`,
                { content },
                { credentials: 'include' } // Include cookies for authentication
            );
            console.log("comment", response)
            return response;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to add comment');
        }
    }
);