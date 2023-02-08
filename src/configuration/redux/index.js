import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { activeLogger } from "../../utils/logger";
import { authSlice } from "./Auth.slice";
import { eventsSlice } from "./Events.slice";
import { layoutSlice } from "./Layout.slice";
import { panelSlice } from "./Panel";
import { settingsSlice } from "./Settings.slice";
import { userSlice } from "./User.slice";
const persistConfig = {
  key: "root-001",
  storage,
  blacklist: ["layout", "settings"],
};
export const combinedReducers = combineReducers({
  auth: authSlice.reducer,
  layout: layoutSlice.reducer,
  events: eventsSlice.reducer,
  panel: panelSlice.reducer,
  settings: settingsSlice.reducer,
  user: userSlice.reducer,
});
const persistedReducer = persistReducer(persistConfig, combinedReducers);
const logs = activeLogger ? [logger] : [];
export default configureStore({
  reducer: persistedReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    ...logs,
  ],
});
