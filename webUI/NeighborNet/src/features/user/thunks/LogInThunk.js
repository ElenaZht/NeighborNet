import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";


export const loginUser = createAsyncThunk(
    'user/login',
    async (loginCredentials, { rejectWithValue }) => {
        
        try {
            const response = await post(`${BASE_URL}/users/login`,
                loginCredentials,
                {credentials: 'include' // For cookies
            });
            
            return response;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);