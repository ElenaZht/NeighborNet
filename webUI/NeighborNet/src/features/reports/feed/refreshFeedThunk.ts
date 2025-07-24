import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllReports } from "./getAllReportsThunk";
import { clearFeed, setError } from "./feedSlice";
import { RootState } from "../../../store/store";

export const refreshFeed = createAsyncThunk(
    'feed/refresh',
    async (_, { dispatch, getState }) => {
        const { user, feed } = getState() as RootState;
        const { currentUser } = user;
        const { filters } = feed;
        
        if (!currentUser) return;
        
        // Deep clone the filters object to prevent unintended mutations
        const clonedFilters = JSON.parse(JSON.stringify(filters));

        // Ensure filters.areaFilter has a valid default value
        if (!['COUNTRY', 'CITY', 'NBR'].includes(clonedFilters.areaFilter)) {
            clonedFilters.areaFilter = 'CITY'; // Default to CITY if invalid
        }

        // Ensure filters.categoryFilter is always an array and not an empty string
        if (!Array.isArray(clonedFilters.categoryFilter) || clonedFilters.categoryFilter.length === 0 || clonedFilters.categoryFilter === "") {
            clonedFilters.categoryFilter = ['GIVEAWAY']; // Default to GIVEAWAY if invalid
        }

        // Ensure loc is valid or omitted
        const loc = currentUser.location && typeof currentUser.location.lat === 'number' && typeof currentUser.location.lng === 'number'
            ? {
                lat: String(currentUser.location.lat),
                lng: String(currentUser.location.lng)
            }
            : undefined;



        try {
            dispatch(clearFeed());
 
            return await dispatch(getAllReports({ 
                offset: 0, 
                limit: 10, 
                neighborhood_id: currentUser.neighborhood_id,
                city: currentUser.city,
                loc,
                filters: clonedFilters
            }));
        } catch (error) {
            console.error('Error refreshing feed:', error);
            // Dispatch an action to update the UI state with the error
            dispatch(setError('Failed to refresh feed. Please try again later.'));
        }
    }
);