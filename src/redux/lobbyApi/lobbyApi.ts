import {BaseQueryArg, createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {io} from "socket.io-client";
import {CREATE_LOBBY} from "../../api/requests/config.ts";
import {Lobby} from "../lobbies/types.ts";

export interface Message {
    userID: string
}

export interface CreateLobbyRes {
    type: string,
    data: {
        userId: string,
    },
}

export enum LobbyEvents {
    JOIN_LOBBY = 'joinLobby',
    CREATE_LOBBY = 'createLobby',
    LEFT_LOBBY = 'leftLobby',
}
let socket: WebSocket

function getSocket() {
    if(!socket) {
        socket = new WebSocket("ws://localhost:10000/ws");
    }
    return socket;
}

export const lobbyApi = createApi({
    reducerPath: 'websocketApi',
    baseQuery: fetchBaseQuery({baseUrl: "http://localhost:10000/"}),
    endpoints: (builder) => ({
        sendMessage: builder.mutation<string, CreateLobbyRes>({
            queryFn: (message: CreateLobbyRes) => {
                const ws = getSocket()

                return new Promise((resolve) => {
                    ws.send(JSON.stringify(message))
                    resolve({data: "message"})
                })
            },
        }),
        createLobby: builder.mutation<string, CreateLobbyRes>({
            queryFn: (message: CreateLobbyRes) => {
                const ws = getSocket()

                return new Promise((resolve) => {
                    ws.send(JSON.stringify(message))
                    resolve({data: "message"})
                })
            },
        }),
        getMessages: builder.query<Lobby, void>({
            // query: () => '',
            queryFn: () => ({data: {}}),
            async onCacheEntryAdded(arg, lifecycleApi) {
                console.log("cacheAdd", arg)
                const ws = getSocket()

                try {
                    await lifecycleApi.cacheDataLoaded

                    // when data is received from the socket connection to the server,
                    // if it is a message and for the appropriate channel,
                    // update our query result with the received message
                    console.log("onmessage", arg)
                    ws.onmessage = (event: MessageEvent) => {
                        const data: Lobby = JSON.parse(event.data)
                        console.log("listener", data)
                        lifecycleApi.updateCachedData((draft) => {
                            draft.id=data.id
                            draft.owner=data.owner
                            draft.settings=data.settings
                            draft.users=data.users
                        })
                    }

                    // const socket = io("ws://localhost:10000/ws",)
                    // console.log("join socket")
                    // socket.on("connect", () => {
                    //     ///socket.emit("")
                    //     socket.emit(LobbyEvents.JOIN_LOBBY);
                    //     console.log("joinLobby");
                    // })
                    //
                    // socket.on(LobbyEvents.RECEIVE_MESSAGE, (message: Message) => {
                    //     updateCachedData((draft) => {
                    //         draft = message;
                    //     });
                    //
                    // })

                }
                catch (err) {
                    console.log('err', err);
                    // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
                    // in which case `cacheDataLoaded` will throw
                }

                await lifecycleApi.cacheEntryRemoved

                ws.close()
            }
        }),
    })
})

export const {useGetMessagesQuery, useCreateLobbyMutation} = lobbyApi