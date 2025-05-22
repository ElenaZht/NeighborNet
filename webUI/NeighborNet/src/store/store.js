import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/usersSlice.js'
import issueReportsReducer from "../features/reports/issueReports/issueReportsSlice.js";
import giveAwaysReducer from "../features/reports/giveaways/giveAwaysSlice.js";


const store = configureStore({
    reducer: {
        user: userReducer,
        issueReports: issueReportsReducer,
        giveAways: giveAwaysReducer
    }
})

export default store;