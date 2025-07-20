import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { EditUserPayload, EditUserResponse } from "../types";

/**
 * Thunk to edit user information
 */
export const editUser = createAsyncThunk<
    EditUserResponse,
    EditUserPayload,
    { rejectValue: string }
>(
    'user/edit',
    async ({ userId, userData }, { rejectWithValue }) => {
        
        try {
            if (!userId || userId === 'undefined' || userId === 'null') {
                throw new Error('User ID is required and cannot be undefined or null');
            }
            
            const response = await patch(`${BASE_URL}/users/${userId}`, 
                userData,
                {credentials: 'include'}
            );
            
            if (!response || !response.editedUser) {
                throw new Error('Invalid response from server');
            }

            return response;
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update profile');
        }
    }
);