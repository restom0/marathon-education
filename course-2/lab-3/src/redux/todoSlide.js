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
                    el.note = action.payload.todo;
                    el.status = false;
                }
            });
        },
        finishTask: (state, action) => {
            state.todos.forEach(el => {
                if (el.id === action.payload.id) {
                    el.status = true;
                }
            });
        },
        deleteTaskSlice: (state, action) => {
            state.todos = state.todos.filter((item) => item.id !== action.payload.id);
        }
    }
});

export const { addTask, editTask, finishTask, deleteTaskSlice } = taskSlice.actions;
export const selectTask = (state) => state.task.todos;
export default taskSlice.reducer;
