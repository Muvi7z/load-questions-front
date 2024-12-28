import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {io} from "socket.io-client";
import {CREATE_LOBBY} from "../../api/requests/config.ts";

//const socket = io('ws://localhost:10000');

export interface Message {
    userID: string
}

export enum LobbyEvents {
    SEND_MESSAGE = 'SEND_MESSAGE',
    RECEIVE_MESSAGE = 'RECEIVE_MESSAGE',
    JOIN_LOBBY = 'joinLobby',
    CREATE_LOBBY = 'createLobby',
    LEFT_LOBBY = 'leftLobby',
}

export const lobbyApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: "/ws"}),
    endpoints: (builder) => ({
        getMessages: builder.query<Message, void>({
            query: () => '',
            async onCacheEntryAdded(_, {updateCachedData, cacheDataLoaded, cacheEntryRemoved}) {
                // const ws = new WebSocket();
                await cacheDataLoaded


                try {

                    const socket = io("ws://localhost:8080/ws",)

                    socket.on("connect", () => {
                        ///socket.emit("")
                    })

                    socket.on(LobbyEvents.RECEIVE_MESSAGE, (message: Message) => {
                        updateCachedData((draft) => {
                            draft = message;
                        });

                    })

                    //
                    // const listener = (event: MessageEvent) => {
                    //     const data = JSON.parse(event.data);
                    //
                    //     updateCachedData((draft) => {
                    //         draft.userID = data.userID;
                    //     });
                    //
                    // }

                    // ws.addEventListener("message", listener);
                }
                catch {
                    // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
                    // in which case `cacheDataLoaded` will throw
                }

                await cacheEntryRemoved
            }
        }),
    })
})

export const {useGetMessagesQuery} = lobbyApi