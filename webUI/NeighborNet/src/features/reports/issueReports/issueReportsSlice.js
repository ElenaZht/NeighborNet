import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    allIssueReports: [],
    loading: false,
    error: null
}

const issueReportsSlice = createSlice({
    name: 'issue-reports',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
         .addCase()

    }
    
})

export default issueReportsSlice