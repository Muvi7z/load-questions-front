import {LobbyType, Session} from "../lobbies/types.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface SessionState {
    session: Session | null
    timeGame: number
    musicPosition: number
    status: string,
    error: string | null
}

const initialState: SessionState = {
    session: null,
    timeGame: 0,
    musicPosition: 0,
    status: "idle",
    error: null
}

interface SetSessionPayloadType {
    session: Session | null
    timeGame: number
    musicPosition: number
}

export const sessionSlice = createSlice({
    name: "@@session",
    initialState,
    reducers: {
        setSession: (state: SessionState, action: PayloadAction<SetSessionPayloadType>) => {
            console.log(action.payload, "action.payload")
            state.session = action.payload?.session
            state.timeGame = action.payload?.timeGame
            state.musicPosition = action.payload?.musicPosition
        }
    },
})

export const {setSession} = sessionSlice.actions;

export default sessionSlice.reducer;