import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/usersSlice'
import feedReducer from '../features/reports/feed/feedSlice'


const store = configureStore({
    reducer: {
        user: userReducer,
        feed: feedReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;