import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const getCarts = createAsyncThunk('carts/getCarts', async () => {
    var id = JSON.parse(localStorage.getItem("productId"));
    if (id && id.length > 0) {
        return fetch("https://students.trungthanhweb.com/api/getCart?apitoken=" + localStorage.getItem('token') + "&id=" + JSON.stringify(id))
            .then((res) => res.json());
    }
})
export const cartSlice = createSlice({
    name: 'carts',
    initialState: {
        carts: [],
        loading: false,
        count: 0,
    },
    reducers: {
        deleteItems: (state, action) => {
            state.carts = state.carts.filter((item) => item[0] !== action.payload);
            if (state.carts.length > 0) {
                localStorage.setItem('cart', JSON.stringify(state.carts));
            }
            else {
                localStorage.removeItem('cart');
            }
        },
        countCart: (state, action) => {
            return state.count
        }
    },
    extraReducers: {
        [getCarts.pending]: (state, action) => {
            state.loading = true;
        },
        [getCarts.fulfilled]: (state, action) => {
            state.loading = false;
            state.carts = action.payload.result;
        },
        [getCarts.rejected]: (state, action) => {
            state.loading = false;
        }
    }
})
export const { deleteItems } = cartSlice.actions;
export default cartSlice.reducer