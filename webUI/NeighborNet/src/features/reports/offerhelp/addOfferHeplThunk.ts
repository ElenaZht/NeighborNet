import { createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";
import { CreateOfferHelpPayload, OfferHelpResponse } from "./types";

/**
 * Thunk to add a new offer to help
 */
export const addOfferHelp = createAsyncThunk<
    OfferHelpResponse,
    CreateOfferHelpPayload,
    { rejectValue: string }
>(
    'offerHelp/add',
    async (offerHelpData, { rejectWithValue }) => {
        try {
            const response = await post(`${BASE_URL}/offer-help`, 
                offerHelpData,
                { credentials: 'include' } // Include cookies for authentication
            );
            
            if (!response || !response.offerHelp) {
                throw new Error('Invalid response from server');
            }

            return response;
            
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create help offer');
        }
    }
);