import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient.js";
import { BASE_URL } from "../../../config.js";


export const getAllReports = createAsyncThunk(
    'reports/getAll',
    async ({ offset = 0, limit = 10, neighborhood_id = null, city = null, loc=null, filters = {} }, { rejectWithValue }) => {
        try {
            let url = `${BASE_URL}/reports?offset=${offset}&limit=${limit}`;
            if (neighborhood_id) {
                url += `&neighborhood_id=${neighborhood_id}`;
            }
            if (city) {
                url += `&city=${encodeURIComponent(city)}`;
            }
            
            const response = await post(url, {filters, loc}, { credentials: 'include' });
            
            if (!response || !response.reports) {
                throw new Error('Invalid response from server');
            }
            
            return response; // Returns { reports: [...], hasMore: boolean }
            
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch reports');
        }
    }
);