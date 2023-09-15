import { configureStore } from "@reduxjs/toolkit";
import taskReducer from './todoSlice';
import cateReducer from "./cateSlice";
import brandReducer from "./brandSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
export const store = configureStore({
    reducer: {
        task: taskReducer,
        cate: cateReducer,
        brand: brandReducer,
        cart: cartReducer,
        product: productReducer
    }
})