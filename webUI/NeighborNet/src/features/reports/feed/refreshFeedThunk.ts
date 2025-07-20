import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllReports } from "./getAllReportsThunk";
import { clearFeed } from "./feedSlice";
import { RootState } from "../../../store/store";

export const refreshFeed = createAsyncThunk(
    'feed/refresh',
    async (_, { dispatch, getState }) => {
        const { user, feed } = getState() as RootState;
        const { currentUser } = user;
        const { filters } = feed;
        
        if (!currentUser) return;
        
        dispatch(clearFeed());
        return dispatch(getAllReports({ 
            offset: 0, 
            limit: 10, 
            neighborhood_id: currentUser.neighborhood_id,
            city: currentUser.city,
            loc: currentUser.location,
            filters
        }));
    }
);