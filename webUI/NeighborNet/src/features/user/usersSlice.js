import { createSlice } from '@reduxjs/toolkit';
import { signUpUser } from './thunks/signUpThunk';


const initialState = {
    currentUser: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    isAuthenticated: false,
    accessToken: localStorage.getItem('token') || null,
    loading: false,
    error: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            if (!action.payload) {
                // If no payload, clear the user
                state.currentUser = null;
                state.isAuthenticated = false;
                state.accessToken = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return;
            }
            
            const { user, accessToken } = action.payload;
            
            if (user) {
                state.currentUser = user;
                state.isAuthenticated = true;
                state.error = null;
                localStorage.setItem('user', JSON.stringify(user));
            }
            
            if (accessToken) {
                state.accessToken = accessToken;
                localStorage.setItem('token', accessToken);
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Sign Up User
            .addCase(signUpUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload.user;
                state.isAuthenticated = true;
                state.accessToken = action.payload.accessToken;
                localStorage.setItem('token', action.payload.accessToken);
                state.error = null;
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to sign up';
            });
    }
})

export const {
    setCurrentUser, 
    setLoading, 
    setError,
    clearError
} = usersSlice.actions
export default usersSlice.reducer;