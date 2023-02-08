import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  drag: {
    index: -1,
    position: 0,
    active: false,
    name: "",
    top: 0,
    left: 0,
  },
};
export const panelSlice = createSlice({
  name: "panel",
  initialState,
  reducers: {
    panelUpdate(state, { payload }) {
      Object.assign(state, payload);
    },
    dragUpdate(state, { payload }) {
      state.drag = { ...state.drag, ...payload };
    },
    panelClear(state) {
      Object.assign(state, initialState);
    },
  },
});
export const { panelClear, dragUpdate, panelUpdate } = panelSlice.actions;
