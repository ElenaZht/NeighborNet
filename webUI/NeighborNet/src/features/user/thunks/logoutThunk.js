import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../../config.js";


export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        
        try {
            const response = await fetch(`${BASE_URL}/users/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const data = await response.json(); 
            if (!response.ok) {
                return rejectWithValue(data.message || 'Logout failed');
            }
            return data;
            
        } catch (error) {
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);