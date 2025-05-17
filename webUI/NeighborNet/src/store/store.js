import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/usersSlice.js'

const store = configureStore({
    reducer: {
        user: userReducer
    }
})

export default store;