import React, {useEffect, useState} from 'react'
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useChangeSettingsMutation, useGetMessagesQuery} from "../../redux/lobbyApi/lobbyApi.ts";
import styles from "./SettingsLobby.module.scss"
import {SettingsLobby} from "../../redux/lobbies/types.ts";

const SettingsLobby = () => {
    const {data: message, error, isFetching, isLoading, isSuccess} = useGetMessagesQuery()
    const [changeSetting, {}] = useChangeSettingsMutation()
    const [leader, setLeader] = useState<string>("")

    useEffect(() => {
            const leda = message?.data?.settings?.leaders?.at(0)? message.data.settings.leaders.at(0): ""
        if (leda) {
            setLeader( leda)
        }
    }, [message]);

    const handleChangeLeader = (value: string) => {
        setLeader(value)
        if (message) {
            const settings: SettingsLobby = {
                leaders: [value],
                roundCount: message.data.settings.roundCount,
                sessionCount: message.data.settings.sessionCount,
                time: message.data.settings.time,
            }
            changeSetting(settings)

        }

    }

    return (
        <div className={styles.wrapper}>
            <div>

                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Ведущий</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={leader}
                        label="Ведущий"
                        onChange={(e) => handleChangeLeader(e.target.value)}
                    >
                        {message?.data?.users?.map((user) => {
                            return <MenuItem value={user.uuid}>{user.username}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </div>
            <div>Настройка сессий</div>
            <div>Настройка раундов</div>
            <div>Настройка времени на сессию</div>
            <div>Настройка времени за вопрос</div>
        </div>
    )
}
export default SettingsLobby
