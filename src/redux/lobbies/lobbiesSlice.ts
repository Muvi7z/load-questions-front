import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {LobbyType} from "./types.ts";
import axios from "axios";
import {GET_LOBBIES} from "../../api/requests/config.ts";

interface LobbiesState {
    lobbies: LobbyType[] | null;
    status: string,
    error: string | null
}

export const loadLobbies = createAsyncThunk<LobbyType[]>("@@lobbies/loadLobbies", async (_, thunkApi) => {
    const config = {
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        }
    }
    try {
        const response = await axios.get<LobbyType[]>(GET_LOBBIES, config)
        return response.data;

    } catch (error) {
        console.log(error)
        return thunkApi.rejectWithValue({
            error: error
        })
    }

})

const initialState: LobbiesState = {
    lobbies: null,
    status: "idle",
    error: null
}

export const lobbiesSlice = createSlice({
    name: "@@lobbies",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadLobbies.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(loadLobbies.fulfilled, (state, action) => {
                console.log("action.payload", action.payload)
                state.status = "idle"
                state.lobbies = action.payload
            })
            .addCase(loadLobbies.rejected, (state, action) => {
                console.log("action.payload", action.payload)
                state.status = "rejected"
                state.error = action.payload
            })
    }

})

export const {} = lobbiesSlice.actions;

export default lobbiesSlice.reducer