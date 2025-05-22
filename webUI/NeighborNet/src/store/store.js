import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/usersSlice.js'
import issueReportsReducer from "../features/reports/issueReports/issueReportsSlice.js";

const store = configureStore({
    reducer: {
        user: userReducer,
        issueReports: issueReportsReducer
    }
})

export default store;