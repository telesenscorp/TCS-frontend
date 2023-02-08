import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { Put } from "../server";
import { createAsyncReducersForThunk, stateUpdate } from "./thunk";
const initialState = {
  routeID: null,
  cookies: { bg: "", color: "", title: "", text: "", label: "", to: "" },
  locale: ["en"],
  localeList: [{ label: "English", value: "en" }],
  isLoading: false,
  error: null,
};
export const Lang = {
  en: { label: "English", value: "en" },
  ru: { label: "Русский", value: "ru" },
  ua: { label: "Українська", value: "ua" },
};

const updateSettings = async ({ routeID, cookies, localeList }, language, cb = () => {}, fail = () => {} ) => {
  await Put(["content", routeID], {
    route: "telesens-settings",
    content: JSON.stringify({ cookies, localeList }),
    language,
  }, cb, fail);
};
export const settingsAddLocale = createAsyncThunk("settings/addLocale", async ({ routeID, cookies, localeList, language }) => {
  await updateSettings(
    { routeID, cookies, localeList },
    language,
    () => {},
    (err) => {throw Error(err)}
  );
  return {
    localeList,
    locale: localeList.map((v) => v.value),
  };
});
export const settingsRemoveLocale = createAsyncThunk("settings/removeLocale", async ({ routeID, cookies, localeList, language }) => {
  await updateSettings(
    { routeID, cookies, localeList },
    language,
    () => {},
    (err) => {throw Error(err)}
  );
  return {
    localeList,
    locale: localeList.map((v) => v.value),
  };
});
export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    settingsReset(state, { payload }) {
      const { routeID, cookies, localeList } = payload;
      state.cookies = cookies;
      state.localeList = localeList;
      state.routeID = routeID;
      state.locale = localeList.map((v) => v.value);
    },
    settingsUpdate(state, { payload }) {
      const { language } = payload;
      Object.assign(state, payload);
      let props = _.cloneDeep(state);
      if (state.routeID) updateSettings(props, language);
    },
    settingsChangeCookies(state, { payload }) {
      state.cookies = payload.cookies;
      let props = _.cloneDeep(state);
      if (state.routeID) updateSettings(props, payload.language);
    },
    settingsClear(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: {
    ...createAsyncReducersForThunk(settingsAddLocale, stateUpdate),
    ...createAsyncReducersForThunk(settingsRemoveLocale, stateUpdate),
  },
});
export const { settingsClear, settingsUpdate, settingsReset } = settingsSlice.actions;
