import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {SIGN_UP} from "../../api/requests/config.ts";
import {SingInAnswer, User} from "./types.ts";
import {createApi} from "@reduxjs/toolkit/query";

interface UserState {
    name: string
    token: string
    status: string,
    error: string | null
}


const initialState: UserState = {
    name: "",
    token: "",
    status: "",
    error: null
}

const socket = io('wss://localhost:3001');

const messageAPI = createApi({

})

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
        const user ={
            name: username,
            token: response.data.token
        }
        localStorage.setItem("user", JSON.stringify(user))
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
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.name= action.payload.name
            state.token = action.payload.token
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

export const {setName, setToken, setUser} = userSlice.actions;

export default userSlice.reducer