import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from '../../../utils/apiClient'
import { BASE_URL } from "../../../config";
import { DeleteAccountResponse, UserState } from '../types';

/**
 * Thunk to delete a user account
 */
export const deleteAccount = createAsyncThunk<
    DeleteAccountResponse,
    number,
    { 
        rejectValue: string, 
        state: { user: UserState } 
    }
>(
    'user/delete',
    async (userId, { rejectWithValue }) => {
        
        try {
            // We don't need to use accessToken here since we're using credentials: 'include'
            
            const response = await del(
                `${BASE_URL}/users/${userId}`,
                { credentials: 'include' }
            );
            
            return response;
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);