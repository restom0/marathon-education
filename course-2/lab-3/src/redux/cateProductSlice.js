import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const getCateProducts = createAsyncThunk('cateProducts/getCateProducts', async () => {
    var id = localStorage.getItem('id');
    var page = localStorage.getItem('page');
    return fetch("https://students.trungthanhweb.com/api/getCateProducts?apitoken=" + localStorage.getItem('token') + "&id=" + id + "&page=" + page)
        .then((res) => res.json());
})
export const cateProductSlice = createSlice({
    name: 'cateProducts',
    initialState: {
        cateProducts: [],
        loading: false
    },
    extraReducers: {
        [getCateProducts.pending]: (state, action) => {
            state.loading = true;
        },
        [getCateProducts.fulfilled]: (state, action) => {
            state.loading = false;
            state.cateProducts = action.payload.products;
        },
        [getCateProducts.rejected]: (state, action) => {
            state.loading = false;
        }
    }
})
export default cateProductSlice.reducer