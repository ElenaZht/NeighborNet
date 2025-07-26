import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";

interface AddCommentParams {
  reportType: string;
  reportId: number;
  content: string;
}

export const addComment = createAsyncThunk(
    'comments/add',
    async ({ reportType, reportId, content }: AddCommentParams, { rejectWithValue }) => {
        try {
            // The backend route structure is /comments/:reportType/:reportId
            const response = await post(
                `${BASE_URL}/comments/${reportType}/${reportId}`,
                { content },
                { credentials: 'include' } // Include cookies for authentication
            );
            return response;
            
        } catch (error) {
            return rejectWithValue((error as Error).message || 'Failed to add comment');
        }
    }
);