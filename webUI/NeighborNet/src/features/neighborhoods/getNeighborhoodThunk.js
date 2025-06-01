import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../utils/apiClient';
import { BASE_URL } from "../../config";


export const getNeighborhoodById = createAsyncThunk(
  'neighborhoods/getById',
  async (neighborhoodId, { rejectWithValue }) => {
    try {
      const response = await get(`${BASE_URL}/neighborhoods/${neighborhoodId}`);
      return response.data; 

    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch neighborhood');
    }
  }
);