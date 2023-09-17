import { configureStore } from "@reduxjs/toolkit";

import taskReducer from './todoSlice';
import cateReducer from "./cateSlice";
import brandReducer from "./brandSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import cateProductReducer from "./cateProductSlice";
import brandProductReducer from "./brandProductSlice";
import billsReducer from "./billsSlice";
import billReducer from "./billSlice";

export const store = configureStore({
    reducer: {
        task: taskReducer,
        cate: cateReducer,
        brand: brandReducer,
        cart: cartReducer,
        product: productReducer,
        cateProduct: cateProductReducer,
        brandProduct: brandProductReducer,
        bills: billsReducer,
        bill: billReducer
    }
})