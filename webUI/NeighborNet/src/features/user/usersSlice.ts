import { createSlice } from '@reduxjs/toolkit';
import { signUpUser } from './thunks/signUpThunk';
import { deleteAccount } from './thunks/deleteAccountThunk';
import { loginUser } from './thunks/LogInThunk';
import { logoutUser } from './thunks/logoutThunk';
import { refreshToken } from './thunks/refreshTokenThunk';
import { editUser } from './thunks/editUserThunk';
import { getNeighborhoodById } from '../neighborhoods/getNeighborhoodThunk'
import { UserState } from './types';

const initialState: UserState = {
    currentUser: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    isAuthenticated: !!localStorage.getItem('user'),
    accessToken: localStorage.getItem('token') || null,
    loading: false,
    loginError: null,
    signupError: null,
    address: '',
    location: {lat: '', lng: ''},
    city: '',
    neighborhood_id: null,
    neighborhood: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearLoginError: (state) => {
            state.loginError = null;
        },
        clearSignupError: (state) => {
            state.signupError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Sign Up User
            .addCase(signUpUser.pending, (state) => {
                state.loading = true;
                state.signupError = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.signupError = null;
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
                state.signupError = (action.payload as string) || 'Failed to sign up';
            })
            
            // Delete account
            .addCase(deleteAccount.pending, (state) => {
                state.loading = true;
                state.signupError = null;
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.loading = false;
                state.currentUser = null;
                state.isAuthenticated = false;
                state.accessToken = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('feedFilters');
                localStorage.removeItem('give_away_draft');
                localStorage.removeItem('help_request_draft');
                localStorage.removeItem('issue_report_draft');
                localStorage.removeItem('offer_help_draft');
                state.signupError = null;
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.loading = false;
                state.signupError = (action.payload as string) || 'Failed to delete account';
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.loginError = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.loginError = null;
                state.currentUser = action.payload.user;
                state.isAuthenticated = true;
                state.accessToken = action.payload.accessToken;
                localStorage.setItem('token', action.payload.accessToken);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                state.address = action.payload.user.address;
                state.location = action.payload.user.location;
                state.city = action.payload.user.city;
                state.neighborhood_id = action.payload.user.neighborhood_id;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.loginError = (action.payload as string) || 'Failed to login';
            })

            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.loginError = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.currentUser = null;
                state.isAuthenticated = false;
                state.accessToken = null;
                state.neighborhood = null;
                state.neighborhoodLoading = false;
                state.loginError = null;
                state.address = '';
                state.location = { lat: '', lng: '' };
                state.city = '';
                state.neighborhood_id = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('feedFilters');
                localStorage.removeItem('give_away_draft');
                localStorage.removeItem('help_request_draft');
                localStorage.removeItem('issue_report_draft');
                localStorage.removeItem('offer_help_draft');
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.loginError = (action.payload as string) || 'Failed to logout';
            })

            // Refresh token
            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.loginError = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.loading = false;
                state.loginError = null;
                state.accessToken = action.payload.accessToken;
                localStorage.setItem('token', action.payload.accessToken);
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.loading = false;
                // On token refresh failure, user needs to re-login
                state.currentUser = null;
                state.isAuthenticated = false;
                state.accessToken = null;
                state.neighborhood = null;
                state.neighborhoodLoading = false;
                state.address = '';
                state.location = { lat: '', lng: '' };
                state.city = '';
                state.neighborhood_id = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('feedFilters');
                localStorage.removeItem('give_away_draft');
                localStorage.removeItem('help_request_draft');
                localStorage.removeItem('issue_report_draft');
                localStorage.removeItem('offer_help_draft');
                state.loginError = action.payload || 'Failed to refresh token';
            })

            // Edit user
            .addCase(editUser.pending, (state) => {
                state.loading = true;
                state.signupError = null;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.loading = false;
                state.signupError = null;
                state.currentUser = action.payload.editedUser;
                localStorage.setItem('user', JSON.stringify(action.payload.editedUser));
            })
            .addCase(editUser.rejected, (state, action) => {
                state.loading = false;
                state.signupError = (action.payload as string) || 'Failed to update profile';
            })

            // Get Neighborhood By ID
            .addCase(getNeighborhoodById.pending, (state) => {
                state.neighborhoodLoading = true;
                state.signupError = null;
            })
            .addCase(getNeighborhoodById.fulfilled, (state, action) => {
                state.neighborhoodLoading = false;
                state.signupError = null;
                state.neighborhood = action.payload;
            })
            .addCase(getNeighborhoodById.rejected, (state, action) => {
                state.neighborhoodLoading = false;
                state.signupError = (action.payload as string) || 'Failed to fetch neighborhood';
            });
    }
})

export const {
    clearLoginError,
    clearSignupError
} = usersSlice.actions
export default usersSlice.reducer;