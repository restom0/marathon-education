import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const getProducts = createAsyncThunk('products/getProducts', async () => {
    return fetch("https://students.trungthanhweb.com/api/home?apitoken=" + localStorage.getItem('token'))
        .then((res) => res.json());
})
export const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        loading: false
    },
    reducers: {
        updateProducts: (state, action) => {
            state.products.data = [...state.products.data, ...action.payload];
        }
    },
    extraReducers: {
        [getProducts.pending]: (state, action) => {
            state.loading = true;
        },
        [getProducts.fulfilled]: (state, action) => {
            state.loading = false;
            state.products = action.payload.products;
        },
        [getProducts.rejected]: (state, action) => {
            state.loading = false;
        }
    }
})
export const { updateProducts } = productSlice.actions;
export default productSlice.reducer    