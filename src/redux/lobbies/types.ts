import {UserDTO} from "../user/types.ts";


export type SettingsLobby = {
    leaders: string[]
    time: number
    sessionCount: number
    roundCount: number
}

export type Question = {
    id: string
    question: string
    answer: string
    timeGiving: number
}

export type Session = {
    id: string
    leader: UserDTO
    question: Question
    time: number
}
export type Round = {
    id: string
    sessions: Session[]
}

export interface Lobby {
    id: string
    owner: string
    users: UserDTO[]
    rounds: Round[]
    settings: SettingsLobby
    currentRound: string
    currentSession: string
}