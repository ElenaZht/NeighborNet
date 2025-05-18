import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCurrentUser, setLoading, setError } from '../usersSlice';
import { patch } from "../../../utils/apiClient";

export const editUser = createAsyncThunk(
    'user/edit',
    async ({ userId, userData }, { dispatch, getState, rejectWithValue }) => {
        dispatch(setLoading(true));
        
        try {
            const response = await patch(`http://localhost:3001/users/${userId}`, 
                userData,
                {credentials: 'include'}
            );
            
            // Check if response contains the expected data
            if (!response || !response.editedUser) {
                throw new Error('Invalid response from server');
            }
            
            // Get the current user from state
            const { currentUser } = getState().user;
            
            // Update the user with the edited information
            dispatch(setCurrentUser({
                user: {
                    ...currentUser,
                    ...response.editedUser
                },
                accessToken: getState().user.accessToken
            }));
            
            dispatch(setLoading(false));
            return response;
            
        } catch (error) {
            dispatch(setError(error.message || 'Failed to update profile'));
            dispatch(setLoading(false));
            return rejectWithValue(error.message || 'Failed to update profile');
        }
    }
);