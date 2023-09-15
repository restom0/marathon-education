import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const getBrands = createAsyncThunk('brands/getBrands', async () => {
    return fetch("https://students.trungthanhweb.com/api/home?apitoken=" + localStorage.getItem('token'))
        .then((res) => res.json());
})
export const brandSlice = createSlice({
    name: 'brands',
    initialState: {
        brands: [],
        loading1: false
    },
    extraReducers: {
        [getBrands.pending]: (state, action) => {
            state.loading1 = true;
        },
        [getBrands.fulfilled]: (state, action) => {
            state.loading1 = false;
            state.brands = action.payload.brands;
        },
        [getBrands.rejected]: (state, action) => {
            state.loading1 = false;
        }
    }
})
export default brandSlice.reducer