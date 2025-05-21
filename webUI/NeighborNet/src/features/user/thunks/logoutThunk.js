import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";


export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        
        try {
            const response = await post(`${BASE_URL}/users/logout`,
                _,
                {credentials: 'include' // Include cookies for the server to clear
            });

            return response;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);