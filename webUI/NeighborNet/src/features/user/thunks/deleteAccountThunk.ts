import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from '../../../utils/apiClient'
import { BASE_URL } from "../../../config";
import { DeleteAccountResponse, UserState } from '../types';
import { logoutUser } from './logoutThunk';


export const deleteAccount = createAsyncThunk<
    DeleteAccountResponse,
    number,
    { 
        rejectValue: string, 
        state: { user: UserState } 
    }
>(
    'user/delete',
    async (userId, { dispatch, rejectWithValue }) => {
        try {
            const response = await del(
                `${BASE_URL}/users/${userId}`,
                { credentials: 'include' }
            );

            // Clear user state by dispatching logout
            dispatch(logoutUser());

            return response;
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);