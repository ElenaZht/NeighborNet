import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCurrentUser, setLoading, setError } from '../usersSlice';

export const refreshToken = createAsyncThunk(
    'user/refreshToken',
    async (_, { dispatch, getState, rejectWithValue }) => {
        dispatch(setLoading(true));
        
        try {

            const response = await fetch('http://localhost:3001/users/refresh-token', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' //  include cookies in the request
            });
            
            const data = await response.json(); // token, msg, user_id
            
            if (!response.ok) {
                dispatch(setError(data.message || 'Token refresh failed'));
                dispatch(setLoading(false));
                return rejectWithValue(data.message || 'Token refresh failed');
            }
            
            // Get the current user from state
            const { currentUser } = getState().user;
            
            // Update the user with the new access token
            dispatch(setCurrentUser({
                user: currentUser,
                accessToken: data.accessToken
            }));
            
            dispatch(setLoading(false));
            return data;
            
        } catch (error) {
            dispatch(setError(error.message || 'Network error during token refresh'));
            dispatch(setLoading(false));
            return rejectWithValue(error.message || 'Network error during token refresh');
        }
    }
);