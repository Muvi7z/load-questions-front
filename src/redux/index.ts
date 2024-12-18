import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.ts";
import lobbiesReducer from "./lobbies/lobbiesSlice.ts";

const rootReducer = combineReducers({
    user: userReducer,
    lobbies:lobbiesReducer
});

export const store = configureStore({
    reducer: rootReducer
})

export type AppStore = typeof store

export type RootState = ReturnType<AppStore['getState']>

export type AppDispatch = AppStore['dispatch']

