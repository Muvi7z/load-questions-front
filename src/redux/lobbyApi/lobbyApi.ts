import {io} from "socket.io-client";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query";
import {fetchModule} from "vite";

const socket = io('ws://localhost:10000');

const messageApi = createApi({
    reducerPath: "lobbyApi",
    baseUrl: fetchBaseQuery({baseUrl: "/ws"}),
    endpoints: (builder) => ({
        getMessage: builder.query({
            query: () => 'getMessages',
        }),

        sendMessage: builder.mutation({
            query: () => {
                socket.emit("message", messageApi)
            },
            onQueryStarted: () => {
                console.log("Sending message...")
            }
        })
    })
})

socket.on("connect", () => {
    console.log("connect to server",)
})

socket.on("newMessage", (data) => {
    messageApi.endpoints
})