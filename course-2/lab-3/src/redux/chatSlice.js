import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const getChat = createAsyncThunk("chat/getChat", async () => {
  return fetch(
    "https://students.trungthanhweb.com/api/loadchat?id=" +
      localStorage.getItem("idRole")
  ).then((res) => res.json());
});

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chat: [],
    loading: false,
  },
  extraReducers: {
    [getChat.pending]: (state, action) => {
      state.loading = true;
    },
    [getChat.fulfilled]: (state, action) => {
      state.loading = false;
      state.chat = action.payload;
    },
    [getChat.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});
export default chatSlice.reducer;
