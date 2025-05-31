import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/usersSlice.js'
import issueReportsReducer from "../features/reports/issueReports/issueReportsSlice.js";
import giveAwaysReducer from "../features/reports/giveaways/giveAwaysSlice.js";
import offerHelpReducer from "../features/reports/offerhelp/offerHelpSlice.js";
import helpRequestsReducer from "../features/reports/helpRequests/helpRequestsSlice.js"
import commentsReducer from '../features/reports/comments/commentsSlice.js'
import feedReducer from '../features/reports/feed/feedSlice.js'


const store = configureStore({
    reducer: {
        user: userReducer,
        issueReports: issueReportsReducer,
        giveAways: giveAwaysReducer,
        offerHelp: offerHelpReducer,
        helpRequests: helpRequestsReducer,
        comments: commentsReducer,
        feed: feedReducer,
    }
})

export default store;