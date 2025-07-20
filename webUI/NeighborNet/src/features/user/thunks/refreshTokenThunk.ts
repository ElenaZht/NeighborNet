import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../../config";
import { RefreshTokenResponse } from "../types";

/**
 * Thunk to refresh the user's authentication token
 */
export const refreshToken = createAsyncThunk<
    RefreshTokenResponse,
    void,
    { rejectValue: string }
>(
    'user/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/users/refresh-token`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // include cookies in the request
            });
            
            const data = await response.json() as RefreshTokenResponse;
            
            if (!response.ok) {
                return rejectWithValue(data.message || 'Token refresh failed');
            }

            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error during token refresh');
        }
    }
);