import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  id: "",
  username: "",
  email: "",
  role: "",
  accessToken: "",
  refreshToken: "",
  gallery: [],
  posts: [],
  mails: [],
  logged: false,
  user: { id: "", username: "", role: "" },
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authUpdate(state, { payload }) {
      Object.assign(state, payload);
    },
    authSignOut(state) {
      Object.assign(state, initialState);
    },
    postsUpdate(state, { payload }) {
      state.posts = payload;
    },
    mailsUpdate(state, { payload }) {
      state.mails = payload;
    },
  },
});
export const { authSignOut, authUpdate, postsUpdate, mailsUpdate } = authSlice.actions;
