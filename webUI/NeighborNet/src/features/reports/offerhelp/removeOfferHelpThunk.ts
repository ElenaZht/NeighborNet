import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";


export const removeOfferHelp = createAsyncThunk<
    number, // Return type is the ID of the removed offer help
    number, // Argument type is the ID of the offer help to remove
    { rejectValue: string }
>(
    'offerHelp/remove',
    async (reportId, { rejectWithValue }) => {
        try {
            const response = await del(`${BASE_URL}/offer-help/${reportId}`, 
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response) {
                throw new Error('Invalid response from server');
            }

            return reportId; // ID of the deleted report
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete offer help report');
        }
    }
);