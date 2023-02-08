import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { mobileAndTabletCheck } from "../../utils/browserDetector";
const initialState = {
  language: "en",
  content: {
    routes: [],
    pages: { Home: [] },
    defaults: {},
  },
  contentVersion: 0,
  loaded: false,
  menu: {
    x: 0,
    y: 0,
    visible: false,
  },
  screenWidth: window.innerWidth || document.documentElement.clientWidth,
  mails: [],
  isFull: false,
  isWide: false,
  isTablet: false,
  isMobile: false,
  sideBarWidth: 0,
  mobileBrowser: false,
  widthType: "desktop",
  fixedSideBar: true,
  popUp: {
    visible: false,
    promptTitle: "",
    promptMessage: "",
  },
  wheelEvent: "wheel",
  wheelOpt: false,
  transition: {
    to: "",
    label: "",
  },
};
const s = [1536, 1200, 820, 480]; //steps
export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    contentUpdate(state, { payload }) {
      state.content = payload;
      state.contentVersion = _.now();
    },
    layoutUpdate(state, { payload }) {
      Object.assign(state, payload);
    },
    transitionTo(state, { payload }) {
      state.transition = payload;
    },
    transitionClear(state) {
      state.transition = { to: "", label: "" };
    },
    toggleMenu(state, { payload }) {
      state.menu = { visible: !state.menu.visible, ...payload };
    },
    showPopUp(state, { payload }) {
      state.popUp = { visible: true, ...payload };
    },
    hidePopUp(state) {
      state.popUp.visible = false;
    },
    hideMenu(state) {
      state.menu.visible = false;
    },
    showMenu(state) {
      state.menu.visible = true;
    },
    setScreen(state, { payload }) {
      const { sw, wheelOpt, wheelEvent } = payload;
      Object.assign(state, {
        isFull: sw > s[0],
        isWide: sw <= s[0] && sw > s[1],
        isTablet: sw <= s[1] && sw > s[3],
        isMobile: sw <= s[3],
        sideBarWidth: sw > s[0] ? 360 : sw > s[2] ? 120 : sw > s[3] ? 80 : 0,
        widthType: sw > s[0] ? "desktop" : sw > s[1] ? "laptop" : sw > s[3] ? "tablet" : "mobile",
        mobileBrowser: mobileAndTabletCheck(),
        screenWidth: sw,
        wheelOpt,
        wheelEvent,
      });
    },
    toggleSideBar(state) {
      state.fixedSideBar = !state.fixedSideBar;
    },
    layoutClear(state) {
      Object.assign(state, initialState);
    },
  },
});
export const {
  layoutClear,
  transitionTo,
  transitionClear,
  layoutUpdate,
  toggleMenu,
  hideMenu,
  showMenu,
  setScreen,
  showPopUp,
  hidePopUp,
  toggleSideBar,
  contentUpdate,
} = layoutSlice.actions;
