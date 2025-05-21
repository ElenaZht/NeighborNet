import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";

export const loginUser = createAsyncThunk(
    'user/login',
    async (loginCredentials, { rejectWithValue }) => {
        
        try {
            const response = await post(`${import.meta.env.VITE_DEV_BASE_URL}/users/login`,
                loginCredentials,
                {credentials: 'include' // For cookies
            });
            
            return response;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);