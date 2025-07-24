import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from '../../../utils/apiClient'
import { BASE_URL } from "../../../config";
import { DeleteAccountResponse, UserState } from '../types';
import { logoutUser } from './logoutThunk';
import { useNavigate } from 'react-router-dom';

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
    async (userId, { dispatch, rejectWithValue }) => {
        const navigate = useNavigate();

        try {
            const response = await del(
                `${BASE_URL}/users/${userId}`,
                { credentials: 'include' }
            );

            // Clear user state by dispatching logout
            dispatch(logoutUser());

            // Redirect to login/signup page
            navigate('/login');

            return response;
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);