import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const getBrands = createAsyncThunk('brands/getBrands', async () => {
    return fetch("https://students.trungthanhweb.com/api/home?apitoken=" + localStorage.getItem('token'))
        .then((res) => res.json());
})
export const brandSlice = createSlice({
    name: 'brands',
    initialState: {
        brands: [],
        loading: false
    },
    extraReducers: {
        [getBrands.pending]: (state, action) => {
            state.loading = true;
        },
        [getBrands.fulfilled]: (state, action) => {
            state.loading = false;
            state.brands = action.payload.brands;
        },
        [getBrands.rejected]: (state, action) => {
            state.loading = false;
        }
    }
})
export default brandSlice.reducer