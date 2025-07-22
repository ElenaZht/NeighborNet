import { createAsyncThunk } from "@reduxjs/toolkit";
import { del } from "../../../utils/apiClient";
import { BASE_URL } from "../../../config";

export const removeGiveAwayThunk = createAsyncThunk<
    number, // Return type is the ID of the removed giveaway
    number, // Argument type is the ID of the giveaway to remove
    { rejectValue: string }
>(
    'giveAways/remove',
    async (giveAwayId, { rejectWithValue }) => {
        try {
            await del(
                `${BASE_URL}/give-aways/${giveAwayId}`,
                { credentials: 'include' }
            );

            return giveAwayId;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to delete giveaway';
            return rejectWithValue(errorMessage);
        }
    }
);