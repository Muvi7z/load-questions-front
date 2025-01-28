import React, {useState} from 'react'
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useChangeSettingsMutation, useGetMessagesQuery} from "../../redux/lobbyApi/lobbyApi.ts";
import styles from "./SettingsLobby.module.scss"
import Icon from "@mdi/react";
import {mdiCrown} from "@mdi/js";
import {SettingsLobby} from "../../redux/lobbies/types.ts";

const SettingsLobby = () => {
    const {data: message, error, isFetching, isLoading, isSuccess} = useGetMessagesQuery()
    const [changeSetting, {}] = useChangeSettingsMutation()
    const [leader, setLeader] = useState<string>("")
    const handleChangeLeader = (value: string) => {
        setLeader(value)
        if (message) {
            let settings: SettingsLobby = {
                leaders: [leader],
                roundCount: message.data.settings.roundCount,

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
