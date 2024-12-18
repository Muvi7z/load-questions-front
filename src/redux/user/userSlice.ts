import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {GET_LOBBIES, SIGN_UP} from "../../api/requests/config.ts";

interface UserState {
    name: string
    token: string
    status: string,
    error: string | null
}

type SingInAnswer = {
    token: string
}

const initialState: UserState = {
    name: "",
    token: "",
    status: "",
    error: null
}

export const signUp = createAsyncThunk<SingInAnswer, string>("@@user/signUp", async (username, thunkApi) => {
    const config = {
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        }
    }
    const data = {
        username: username
    }
    try {
        const response = await axios.post<SingInAnswer>(SIGN_UP, data, config)
        return response.data;

    } catch (error) {
        console.log(error)
        return thunkApi.rejectWithValue({
            error: error
        })
    }
})

export const userSlice = createSlice({
    name: "@@user",
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signUp.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(signUp.fulfilled, (state, action) => {
                console.log("action.payload", action.payload)
                state.status = "idle"

                const res = action.payload
                state.token = res.token
            })
            .addCase(signUp.rejected, (state, action) => {
                console.log("action.payload", action.payload)
                state.status = "rejected";
                state.error = action.payload
            })
    }
})

export const {setName} = userSlice.actions;

export default userSlice.reducer