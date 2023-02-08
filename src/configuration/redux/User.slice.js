import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  ip: null,
  locale: null,
  location: null,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userUpdate(state, { payload }) {
      Object.assign(state, payload);
    },
  },
});
export const { userUpdate } = userSlice.actions;
