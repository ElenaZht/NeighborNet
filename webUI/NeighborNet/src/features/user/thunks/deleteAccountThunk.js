import { createAsyncThunk } from "@reduxjs/toolkit";
import {del} from '../../../utils/apiClient.js'
import { BASE_URL } from "../../../config.js";


export const deleteAccount = createAsyncThunk(
    'user/delete',
    async (userId, { dispatch, getState, rejectWithValue }) => {
        
        try {
            const { accessToken } = getState().user;
            
            const response = await del(`${BASE_URL}/users/${userId}`, 
                userId,
                {credentials: 'include'}
        );
            
            return response;
            
        } catch (error) {

            return rejectWithValue(error.message || 'Network error');
        }
    }
);