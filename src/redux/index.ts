import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.ts";
import lobbiesReducer from "./lobbies/lobbiesSlice.ts";
import {lobbyApi} from "./lobbyApi/lobbyApi.ts";

const rootReducer = combineReducers({
    user: userReducer,
    lobbies:lobbiesReducer,
    [lobbyApi.reducerPath]: lobbyApi.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(lobbyApi.middleware),
})

export type AppStore = typeof store

export type RootState = ReturnType<AppStore['getState']>

export type AppDispatch = AppStore['dispatch']

