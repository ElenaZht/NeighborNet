import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCurrentUser, setLoading, setError } from '../usersSlice';
import { post } from "../../../utils/apiClient";


export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { dispatch, rejectWithValue }) => {
        dispatch(setLoading(true));
        
        try {
            const response = await post('http://localhost:3001/users/logout',
                _,
                {credentials: 'include' // Include cookies for the server to clear
            });
            
            // Clear user data on successful logout
            dispatch(setCurrentUser(null)); 

            dispatch(setLoading(false));
            return response;
            
        } catch (error) {
            dispatch(setError(error.message || 'Network error'));
            dispatch(setLoading(false));
            return rejectWithValue(error.message || 'Network error');
        }
    }
);