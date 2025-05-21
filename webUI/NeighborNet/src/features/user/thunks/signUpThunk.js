import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";


export const signUpUser = createAsyncThunk(
    'user/signup',
    async (userData, {dispatch, rejectWithValue}) => {
        try {
            const response = await post(`${import.meta.env.VITE_DEV_BASE_URL}/users/signup`, 
                userData,
                {credentials: 'include' // For cookies
            });
            
            return response;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
)