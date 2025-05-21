import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config.js";


export const signUpUser = createAsyncThunk(
    'user/signup',
    async (userData, {dispatch, rejectWithValue}) => {
        try {
            const response = await post(`${BASE_URL}/users/signup`, 
                userData,
                {credentials: 'include' // For cookies
            });
            
            return response;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
)