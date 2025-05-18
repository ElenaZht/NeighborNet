import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCurrentUser, setLoading, setError } from '../usersSlice';
import {del} from '../../../utils/apiClient.js'


export const deleteAccount = createAsyncThunk(
    'user/delete',
    async (userId, { dispatch, getState, rejectWithValue }) => {
        dispatch(setLoading(true));
        
        try {
            const { accessToken } = getState().user;
            
            const response = await del(`http://localhost:3001/users/${userId}`, 
                userId,
                {credentials: 'include'}
        );
            
            // Clear user data on successful deletion
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