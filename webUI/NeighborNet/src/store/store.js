import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/usersSlice.js'
import feedReducer from '../features/reports/feed/feedSlice.js'


const store = configureStore({
    reducer: {
        user: userReducer,
        feed: feedReducer,
    }
})

export default store;