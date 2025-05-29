import { createSlice } from '@reduxjs/toolkit';
import { signUpUser } from './thunks/signUpThunk';
import { deleteAccount } from './thunks/deleteAccountThunk';
import { loginUser } from './thunks/LogInThunk';
import { logoutUser } from './thunks/logoutThunk';
import { refreshToken } from './thunks/refreshTokenThunk';
import { editUser } from './thunks/editUserThunk';

const initialState = {
    currentUser: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    isAuthenticated: !!localStorage.getItem('user'),
    accessToken: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    address: '',
    location: {lat: '', lng: ''},
    city: '',
    neighborhood_id: null
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
                state.address = user.address
                state.location = user.location,
                state.city = user.city,
                state.neighborhood_id = user.neighborhood_id
            }
            
            if (accessToken) {
                state.accessToken = accessToken;
                localStorage.setItem('token', accessToken);
            }
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
                state.error = null;
                state.isAuthenticated = true;
                state.currentUser = action.payload.user;
                state.accessToken = action.payload.accessToken;
                localStorage.setItem('token', action.payload.accessToken);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                state.address = action.payload.user.address;
                state.location = action.payload.user.location
                state.city = action.payload.user.city
                state.neighborhood_id = action.payload.user.neighborhood_id
                
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to sign up';
            })
            
            // Delete account
            .addCase(deleteAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.loading = false;
                state.currentUser = null;
                state.isAuthenticated = false;
                state.accessToken = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                state.error = null;
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete account';
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload.user;
                state.isAuthenticated = true;
                state.accessToken = action.payload.accessToken;
                localStorage.setItem('token', action.payload.accessToken);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to login';
            })

            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.currentUser = null;
                state.isAuthenticated = false;
                state.accessToken = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to logout';
            })

            // Refresh token
            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                localStorage.setItem('token', action.payload.accessToken);
                state.error = null;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.loading = false;
                // On token refresh failure, user needs to re-login
                state.currentUser = null;
                state.isAuthenticated = false;
                state.accessToken = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                state.error = action.payload || 'Failed to refresh token';
            })

            // Edit user
            .addCase(editUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                
                if (action.payload) {
                    const userData = action.payload.editedUser || action.payload.user || {};
                    
                    // Update currentUser with merged data
                    if (Object.keys(userData).length > 0) {
                        state.currentUser = {
                            ...state.currentUser,
                            ...userData
                        };
                        
                        // Update individual location fields
                        state.address = userData.address || state.address;
                        state.location = userData.location || state.location;
                        state.city = userData.city || state.city;
                        state.neighborhood_id = userData.neighborhood_id || state.neighborhood_id;
                        
                        // Update localStorage
                        localStorage.setItem('user', JSON.stringify(state.currentUser));
                    }
                }
            })
            .addCase(editUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update profile';
            })

            
    }
})

export const {
    clearError
} = usersSlice.actions
export default usersSlice.reducer;