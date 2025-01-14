import {UserDTO} from "../user/types.ts";

export type LobbyType = {

}

export type SettingsLobby = {
    leaders: UserDTO
    time: number
}

export interface Lobby {
    id: string
    owner: string
    users: UserDTO[]
    settings: SettingsLobby
}