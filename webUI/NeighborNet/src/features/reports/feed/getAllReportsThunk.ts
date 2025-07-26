import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { GetAllReportsParams } from "./types";

export const getAllReports = createAsyncThunk(
    'reports/getAll',
    async ({ offset = 0, limit = 10, neighborhood_id = null, city = null, loc = null, filters = {} }: GetAllReportsParams, { rejectWithValue }) => {
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
            return rejectWithValue((error as Error).message || 'Failed to fetch reports');
        }
    }
);