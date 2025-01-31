import {Lobby} from "../lobbies/types.ts";

export interface CreateLobbyRes {
    type: string,
    data: {
        userId: string,
    },
}

export interface SessionStart {
    type: string,
    data: {
        leader: string,
    },
}

export interface GameStartDTO {
    type: string,
}

export interface JoinLobbyDTO {
    type: string,
    data: {
        userId: string,
        lobbyId: string
    },
}

export interface Message {
    type: string,
    sendBy:string
    data: Lobby,
}

export interface MessageDTO {
    type: string,
    sendBy?:string
    data?: any,
}