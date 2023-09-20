import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    todos: [],
}

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        addTask: (state, action) => {
            state.todos.push(action.payload);
        },
        editTask: (state, action) => {
            state.todos.forEach(el => {
                if (el.id === action.payload.id) {
                    el.todo = action.payload.todo;
                    el.status = false;
                }
            });
        },
        finishTask: (state, action) => {
            console.log(action.payload);
            state.todos.forEach(el => {
                if (el.id === action.payload) {
                    el.status = true;
                }
            });
        },
        deleteTaskSlice: (state, action) => {
            state.todos = state.todos.filter((item) => item.id !== action.payload);
        }
    }
});

export const { addTask, editTask, finishTask, deleteTaskSlice } = taskSlice.actions;
export const selectTask = (state) => state.todos;
export default taskSlice.reducer;
