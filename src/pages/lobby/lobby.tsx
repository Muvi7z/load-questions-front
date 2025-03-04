import React, {ComponentProps, FC, useEffect, useRef, useState} from "react";
import {
    JoinLobbyDTO,
    LobbyEvents,
    useGetMessagesQuery,
    useJoinLobbyMutation,
    useStartSessionMutation
} from "../../redux/lobbyApi/lobbyApi.ts";
import styles from "./lobby.module.scss"
import {UserDTO} from "../../redux/user/types.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useAppSelector} from "../../redux/hooks.ts";
import {Box, Button, createTheme, dividerClasses, styled, Tab, Tabs, ThemeProvider, Typography} from "@mui/material";
import SettingsLobby from "../../components/SettingsLobby/SettingsLobby.tsx";
import Icon from "@mdi/react";
import {mdiCrown} from "@mdi/js";

type LobbyPropsType = ComponentProps<"div">

const Lobby: FC<LobbyPropsType> = ({}) => {
    const {data: message, error, isFetching, isLoading, isSuccess} = useGetMessagesQuery()
    const [joinLobby, {isLoading: lobbyIsLoading}] = useJoinLobbyMutation()
    const [startSession, {}] = useStartSessionMutation()

    const {token} = useAppSelector(state => state.user)
    const {session} = useAppSelector(state => state.session)

    const navigate = useNavigate();
    const [startGame, setStartGame] = useState(false)
    const params = useParams()
    const [tab, setTab] = useState("game")

    console.log("lobby", message)

    const whiteTheme = createTheme({
        palette: {
            mode: 'light',
        },
    });

    useEffect(() => {
        console.log("reconnect")
        if (params?.lobbyId && message?.data?.id !== params?.lobbyId) {
            const userStr = localStorage.getItem('user')
            if (userStr) {
                const retrievedUser = JSON.parse(userStr);
                const dto: JoinLobbyDTO = {
                    type: LobbyEvents.JOIN_LOBBY,
                    data: {
                        lobbyId: params.lobbyId,
                        userId: retrievedUser.token
                    }
                }
                joinLobby(dto)
            }

        }

    }, [])

    useEffect(() => {
        if ( session) {
            navigate(`/session/${message?.data?.id}/${session.id}`)
        }
    }, [ session]);

    const onStartGame = () => {
        if (message?.data?.users && message?.data?.users?.length > 0) {
            const leader = message.data.settings.leaders?.at(0)
            if (leader) {
                startSession({
                    type: LobbyEvents.START_SESSION,
                    data: {
                        leader: leader
                    }
                }).then((data) => setStartGame(true))
            }
        } else {
            console.log("error")
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.lobbyTitle}>{message?.data?.id}</div>
            <div className={styles.list}>
                {message?.data?.users?.map((item: UserDTO) => {
                    return <div className={styles.list_item}>
                        <div className={styles.avatar}>
                            {message.data?.owner === item?.uuid && <div className={styles.crown}><Icon path={mdiCrown}
                                                                                                       title="User Profile"
                                                                                                       size={0.80}
                                                                                                       horizontal
                                                                                                       color="#eaca18"
                            /></div>}
                            {item.username[0]}</div>
                        <div>

                            <div className={styles.username}>{item.username}</div>
                            <div
                                className={styles.role}>{message.data?.settings?.leaders?.at(0) === item?.uuid ? "Ведущий" : "Игрок"}</div>
                        </div>
                    </div>
                })}
            </div>

            <div className={styles.settings}>
                <ThemeProvider theme={whiteTheme}>
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <Tabs value={tab} sx={{userSelect: "none"}} onChange={(_, value) => setTab(value)}
                              aria-label="basic tabs example">
                            <Tab sx={{fontSize: "18px"}} label="Игра" value={"game"}/>
                            <Tab sx={{fontSize: "18px"}} label="Настройки" value={"settings"}/>
                        </Tabs>
                    </Box>
                    {tab === "game" && <div className={styles.game}>
                        {message?.data?.rounds?.map((round, id) => {
                            console.log("round", round)
                            return <>
                                <div className={styles.header}>
                                    <Typography variant="h5">Раунд {id + 1}</Typography>
                                    <div
                                        className={styles.countSession}>{message?.data?.settings?.sessionCount}/{round?.sessions?.length ? round?.sessions?.length : 0}</div>
                                </div>
                                {round?.sessions && round?.sessions?.length > 0 ? <div>

                                </div> : <div>Сессии еще не сыграны</div>}
                            </>
                        })}
                    </div>
                    }
                    {tab === "settings" && <div>
                        <SettingsLobby/>
                    </div>}
                </ThemeProvider>
            </div>
            <div className={styles.control}>
                <Button className={styles.btn} variant={"contained"} size={"large"}>Пригласить</Button>
                <Button className={styles.btn} onClick={() => onStartGame()} sx={{minWidth: "150px"}}
                        variant={"contained"} size={"large"}>Играть</Button>
            </div>
        </div>
    )
}

export default Lobby;