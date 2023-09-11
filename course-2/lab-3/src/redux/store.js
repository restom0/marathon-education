import { configureStore } from "@reduxjs/toolkit";
import taskReducer from './todoSlide';
const store = configureStore({
    reducer: {
        task: taskReducer
    }
})
export default store;