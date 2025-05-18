import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCurrentUser, setLoading, setError } from '../usersSlice';

export const deleteAccount = createAsyncThunk(
    'user/delete',
    async (userId, { dispatch, getState, rejectWithValue }) => {
        dispatch(setLoading(true));
        
        try {
            const { accessToken } = getState().user;
            
            const response = await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                dispatch(setError(data.message || 'Failed to delete account'));
                dispatch(setLoading(false));
                return rejectWithValue(data.message || 'Failed to delete account');
            }
            
            // Clear user data on successful deletion
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