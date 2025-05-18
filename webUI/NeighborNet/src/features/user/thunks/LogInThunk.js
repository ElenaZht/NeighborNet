import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCurrentUser, setLoading, setError } from '../usersSlice';

export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials, { dispatch, rejectWithValue }) => {
        dispatch(setLoading(true));
        
        try {
            const response = await fetch('http://localhost:3001/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include' // For cookies
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                dispatch(setError(data.message || 'Login failed'));
                dispatch(setLoading(false));
                return rejectWithValue(data.message || 'Login failed');
            }
            
            // Store user data and token
            dispatch(setCurrentUser({
                user: data.user,
                accessToken: data.accessToken
            }));
            
            dispatch(setLoading(false));
            return data;
            
        } catch (error) {
            dispatch(setError(error.message || 'Network error'));
            dispatch(setLoading(false));
            return rejectWithValue(error.message || 'Network error');
        }
    }
);