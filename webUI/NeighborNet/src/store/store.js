import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/usersSlice.js'
import issueReportsReducer from "../features/reports/issueReports/issueReportsSlice.js";
import giveAwaysReducer from "../features/reports/giveaways/giveAwaysSlice.js";
import offerHelpReducer from "../features/reports/offerhelp/offerHelpSlice.js";


const store = configureStore({
    reducer: {
        user: userReducer,
        issueReports: issueReportsReducer,
        giveAways: giveAwaysReducer,
        offerHelp: offerHelpReducer
    }
})

export default store;