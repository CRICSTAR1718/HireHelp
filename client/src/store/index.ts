import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// Use redux-persist's native ESM build. Vite/Rolldown can otherwise expose the
// CommonJS module wrapper here, rather than its default storage adapter.
import storage from "redux-persist/es/storage";
import authReducer from "./authSlice";

// Only auth/session is global cross-domain state. Everything else
// (requisitions, candidates, interviews, users, etc.) is server state
// and lives in TanStack Query caches, not Redux.
const rootReducer = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: "hirehelp-root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
