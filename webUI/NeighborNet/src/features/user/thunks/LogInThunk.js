import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCurrentUser, setLoading, setError } from '../usersSlice';
import { post } from "../../../utils/apiClient";

export const loginUser = createAsyncThunk(
    'user/login',
    async (loginCredentials, { dispatch, rejectWithValue }) => {
        dispatch(setLoading(true));
        
        try {
            const response = await post('http://localhost:3001/users/login', 
                loginCredentials,
                {credentials: 'include' // For cookies
            });
            
            // Store user data and token
            dispatch(setCurrentUser({
                user: response.user,
                accessToken: response.accessToken
            }));
            
            dispatch(setLoading(false));
            return response;
            
        } catch (error) {
            dispatch(setError(error.message || 'Network error'));
            dispatch(setLoading(false));
            return rejectWithValue(error.message || 'Network error');
        }
    }
);