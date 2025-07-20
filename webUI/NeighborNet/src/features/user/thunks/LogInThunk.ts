import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../../config";
import { LoginCredentials, AuthResponse } from "../../../types/user";


export const loginUser = createAsyncThunk<
    AuthResponse,
    LoginCredentials,
    { rejectValue: string }
>(
    'user/login',
    async (loginCredentials, { rejectWithValue }) => {
        
        try {

            const response = await fetch(`${BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginCredentials),
                credentials: 'include'
            });
            const data = await response.json(); 
            if (!response.ok) {
                return rejectWithValue(data.message || 'Login failed');
            }
            return data;
            
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
        }
    }
);