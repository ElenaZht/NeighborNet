import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCurrentUser, setLoading, setError } from '../usersSlice';


export const signUpUser = createAsyncThunk(
    'user/signup',
    async (userData, {dispatch, rejectWithValue}) => {
        dispatch(setLoading(true));
        try {
            const response = await fetch('http://localhost:3001/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include' // For cookies
            });
            const data = await response.json();

            if (!response.ok) {
                dispatch(setError(data.message || 'Signup failed'));
                dispatch(setLoading(false));
                return rejectWithValue(data.message || 'Signup failed');
            }

            dispatch(setCurrentUser({
                user: data.user,
                accessToken: data.accessToken
            }));
            
            dispatch(setLoading(false));
            return data;
            
        } catch (error) {
            dispatch(setError(error.message || 'Network error'));
            dispatch(setLoading(false));
            return rejectWithValue(error.message || 'Network error');
        }
    }
)