import { createAsyncThunk } from "@reduxjs/toolkit";


export const refreshToken = createAsyncThunk(
    'user/refreshToken',
    async (_, { rejectWithValue }) => {
        
        try {

            const response = await fetch(`${import.meta.env.VITE_DEV_BASE_URL}/users/refresh-token`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' //  include cookies in the request
            });
            
            const data = await response.json(); // token, msg, user_id
            
            if (!response.ok) {
                return rejectWithValue(data.message || 'Token refresh failed');
            }

            return data;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Network error during token refresh');
        }
    }
);