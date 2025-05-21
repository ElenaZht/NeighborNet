import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch } from "../../../utils/apiClient";


export const editUser = createAsyncThunk(
    'user/edit',
    async ({ userId, userData }, { rejectWithValue }) => {
        
        try {
            const response = await patch(`${import.meta.env.VITE_DEV_BASE_URL}/users/${userId}`, 
                userData,
                {credentials: 'include'}
            );
            
            // Check if response contains the expected data
            if (!response || !response.editedUser) {
                throw new Error('Invalid response from server');
            }

            return response;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update profile');
        }
    }
);