import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const getBills = createAsyncThunk('bills/getBills', async () => {
    return fetch("https://students.trungthanhweb.com/api/bills?apitoken=" + localStorage.getItem('token'))
        .then((res) => res.json());
})

export const billsSlice = createSlice({
    name: 'bills',
    initialState: {
        bills: [],
        loading: false,
    },
    extraReducers: {
        [getBills.pending]: (state, action) => {
            state.loading = true;
        },
        [getBills.fulfilled]: (state, action) => {
            state.loading = false;
            state.bills = action.payload.bills;
        },
        [getBills.rejected]: (state, action) => {
            state.loading = false;
        },
    }
})
export default billsSlice.reducer