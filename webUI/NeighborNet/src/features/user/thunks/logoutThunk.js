import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";


export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        
        try {
            const response = await post(`${import.meta.env.VITE_DEV_BASE_URL}/users/logout`,
                _,
                {credentials: 'include' // Include cookies for the server to clear
            });

            return response;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);