import { createAsyncThunk } from "@reduxjs/toolkit";
import {del} from '../../../utils/apiClient.js'


export const deleteAccount = createAsyncThunk(
    'user/delete',
    async (userId, { dispatch, getState, rejectWithValue }) => {
        
        try {
            const { accessToken } = getState().user;
            
            const response = await del(`${import.meta.env.VITE_DEV_BASE_URL}/users/${userId}`, 
                userId,
                {credentials: 'include'}
        );
            
            return response;
            
        } catch (error) {

            return rejectWithValue(error.message || 'Network error');
        }
    }
);