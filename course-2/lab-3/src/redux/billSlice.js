import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const getBill = createAsyncThunk('bill/getBill', async () => {
    var id = JSON.parse(localStorage.getItem("billId"));
    if (id) {
        return fetch("https://students.trungthanhweb.com/api/singlebill?apitoken=" + localStorage.getItem('token') + "&id=" + JSON.stringify(parseInt(id)))
            .then((res) => res.json());
    }
})
export const billSlice = createSlice({
    name: 'bill',
    initialState: {
        bill: [],
        loading2: false,
    },
    extraReducers: {
        [getBill.pending]: (state, action) => {
            state.loading2 = true;
        },
        [getBill.fulfilled]: (state, action) => {
            state.loading2 = false;
            state.bill = action.payload.result;
        },
        [getBill.rejected]: (state, action) => {
            state.loading2 = false;
        },
    }
})
export default billSlice.reducer