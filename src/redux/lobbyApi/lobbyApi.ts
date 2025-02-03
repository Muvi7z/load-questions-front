import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { SettingsLobby} from "../lobbies/types.ts";
import {CreateLobbyRes, JoinLobbyDTO, Message, MessageDTO, SessionStart} from "./types.ts";
import {setSession} from "../session/sessionSlice.ts";



export enum LobbyEvents {
    JOIN_LOBBY = 'joinLobby',
    CREATE_LOBBY = 'createLobby',
    LEFT_LOBBY = 'leftLobby',
    CHANGE_SETTINGS= "changeSettings",
    START_SESSION= "startSession",
    START_GAME= "startGame",
    JOIN_GAME= "joinGame",
}
let socket: WebSocket

function getSocket() {
    console.log("socket",socket)
    if(!socket) {
        socket = new WebSocket("ws://localhost:10000/ws");
    }
    return socket;
}

export const lobbyApi = createApi({
    reducerPath: 'websocketApi',
    baseQuery: fetchBaseQuery({baseUrl: "http://localhost:10000/"}),
    endpoints: (builder) => ({
        createLobby: builder.mutation<string, CreateLobbyRes>({
            queryFn: (message: CreateLobbyRes) => {
                const ws = getSocket()

                return new Promise((resolve) => {
                    ws.send(JSON.stringify(message))
                    resolve({data: "message"})
                })
            },
        }),
        joinLobby: builder.mutation<string, JoinLobbyDTO>({
            queryFn: (message: JoinLobbyDTO) => {
                const ws = getSocket()

                return new Promise((resolve) => {
                    console.log("ws.readyState", ws, message)
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify(message))
                        resolve({data: "message"})
                    } else {
                        ws.addEventListener("open", () => {
                            ws.send(JSON.stringify(message))
                            resolve({data: "message"})
                        })
                    }
                })
            },
        }),
        changeSettings: builder.mutation<string, SettingsLobby>({
            queryFn: (message: SettingsLobby) => {
                const ws = getSocket()
                const msg: MessageDTO = {
                    type: LobbyEvents.CHANGE_SETTINGS,
                    data: message,
                }
                return new Promise((resolve) => {
                    ws.send(JSON.stringify(msg))
                    resolve({data: "message"})
                })
            },
        }),
        startSession: builder.mutation<string, SessionStart>({
            queryFn: (message: SessionStart) => {
                const ws = getSocket()

                return new Promise((resolve) => {
                    ws.send(JSON.stringify(message))
                    resolve({data: "message"})
                })
            },
        }),
        startGame: builder.mutation<string, void>({
            queryFn: () => {
                const ws = getSocket()

                return new Promise((resolve) => {
                    ws.send(JSON.stringify({
                        type: LobbyEvents.START_GAME,
                    }))
                    resolve({data: "message"})
                })
            },
        }),
        sendMessage: builder.mutation<string, MessageDTO>({
            queryFn: (message: MessageDTO) => {
                const ws = getSocket()
                console.log("sendMessage/ws",ws)

                return new Promise((resolve) => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify(message))
                        resolve({data: "message"})
                    } else {
                        ws.addEventListener("open", () => {
                            ws.send(JSON.stringify(message))
                            resolve({data: "message"})
                        })
                    }
                })
            },
        }),
        getMessages: builder.query<Message, void>({
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
                        if (event?.data?.code) {
                            console.error('Error in WebSocket handler:', event?.data?.code);
                        }
                        const res: MessageDTO = JSON.parse(event.data)
                        console.log("listener", res)
                        lifecycleApi.updateCachedData((draft) => {
                            switch (res.type) {
                                case LobbyEvents.CREATE_LOBBY:
                                    draft.type=res.type;
                                    draft.sendBy=res?.sendBy?res?.sendBy:"";
                                    draft.data=res.data
                                    break;
                                case LobbyEvents.JOIN_LOBBY:
                                    draft.type=res.type;
                                    draft.sendBy=res?.sendBy?res?.sendBy:"";
                                    draft.data=res.data
                                    break;
                                case LobbyEvents.LEFT_LOBBY:
                                    draft.data.users?.filter((user) => user.uuid != res?.data?.user?.uuid)
                                    break;
                                case LobbyEvents.CHANGE_SETTINGS:
                                    draft.data.settings = res.data
                                    break;
                                case LobbyEvents.START_SESSION:
                                    lifecycleApi.dispatch(setSession({
                                        session: res.data?.session,
                                        timeGame: 0,
                                    }))
                                    break;
                                case LobbyEvents.JOIN_GAME:
                                    draft.data = res.data?.lobby
                                    lifecycleApi.dispatch(setSession({
                                        session: res.data?.session,
                                        timeGame: res.data?.timeGame,
                                    }))
                                    break;
                            }
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

export const {
    useStartSessionMutation,
    useGetMessagesQuery,
    useCreateLobbyMutation,
    useJoinLobbyMutation,
    useChangeSettingsMutation,
    useStartGameMutation,
    useSendMessageMutation,
} = lobbyApi