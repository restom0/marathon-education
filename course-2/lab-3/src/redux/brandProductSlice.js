import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const getBrandProducts = createAsyncThunk('brandProducts/getBrandProducts', async () => {
    var id = localStorage.getItem('id');
    var page = localStorage.getItem('page');
    return fetch("https://students.trungthanhweb.com/api/getBrandProducts?apitoken=" + localStorage.getItem('token') + "&id=" + id + "&page=" + page)
        .then((res) => res.json());
})
export const brandProductSlice = createSlice({
    name: 'brandProducts',
    initialState: {
        brandProducts: [],
        loading: false
    },
    extraReducers: {
        [getBrandProducts.pending]: (state, action) => {
            state.loading = true;
        },
        [getBrandProducts.fulfilled]: (state, action) => {
            state.loading = false;
            state.brandProducts = action.payload.products;
        },
        [getBrandProducts.rejected]: (state, action) => {
            state.loading = false;
        }
    }
})
export default brandProductSlice.reducer