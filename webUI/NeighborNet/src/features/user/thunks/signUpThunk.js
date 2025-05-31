import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../../config.js";


export const signUpUser = createAsyncThunk(
    'user/signup',
    async (userData, {rejectWithValue}) => {
        try {
            const response = await fetch(`${BASE_URL}/users/signup`, {
                body: JSON.stringify(userData),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            
            const data = await response.json(); 
            if (!response.ok) {
                return rejectWithValue(data.message || 'Sign up failed');
            }
            return data;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
)