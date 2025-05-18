import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCurrentUser, setLoading, setError } from '../usersSlice';

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { dispatch, rejectWithValue }) => {
        dispatch(setLoading(true));
        
        try {
            const response = await fetch('http://localhost:3001/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Include cookies for the server to clear
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                dispatch(setError(data.message || 'Logout failed'));
                dispatch(setLoading(false));
                return rejectWithValue(data.message || 'Logout failed');
            }
            
            // Clear user data on successful logout
            dispatch(setCurrentUser(null));
            dispatch(setLoading(false));
            return data;
            
        } catch (error) {
            dispatch(setError(error.message || 'Network error'));
            dispatch(setLoading(false));
            return rejectWithValue(error.message || 'Network error');
        }
    }
);