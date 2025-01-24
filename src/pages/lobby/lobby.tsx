import {ComponentProps, FC, useEffect, useState} from "react";
import {JoinLobbyDTO, LobbyEvents, useGetMessagesQuery, useJoinLobbyMutation} from "../../redux/lobbyApi/lobbyApi.ts";
import styles from "./lobby.module.scss"
import {UserDTO} from "../../redux/user/types.ts";
import {useParams} from "react-router-dom";
import {useAppSelector} from "../../redux/hooks.ts";
import {Box, Button, createTheme, dividerClasses, styled, Tab, Tabs, ThemeProvider, Typography} from "@mui/material";

type LobbyPropsType = ComponentProps<"div">

const Lobby: FC<LobbyPropsType> = ({}) => {
    const {data: message, error, isFetching, isLoading, isSuccess} = useGetMessagesQuery()
    const [joinLobby, {isLoading: lobbyIsLoading}] = useJoinLobbyMutation()
    const {token} = useAppSelector(state => state.user)
    const params = useParams()
    const [tab, setTab] = useState("game")

    const whiteTheme = createTheme({
        palette: {
            mode: 'light',
        },
    });

    console.log(":sss", lobbyIsLoading)
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

    const onStartGame = () => {
        if (message?.data?.users && message?.data?.users?.length>0) {

        } else  {

        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.list}>
                {message?.data?.users?.map((item: UserDTO) => {
                    return <div className={styles.list_item}>
                        <div className={styles.avatar}>{item.username[0]}</div>
                        <div>
                            <div className={styles.username}>{item.username}</div>
                            <div className={styles.role}>{message.data?.owner === item?.uuid ? "Хост" : "Игрок"}</div>
                        </div>
                    </div>
                })}
            </div>
            <div className={styles.settings}>
                <ThemeProvider theme={whiteTheme}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <Tabs value={tab} sx={{userSelect:"none"}} onChange={(_, value) => setTab(value)} aria-label="basic tabs example">
                            <Tab label="Игра" value={"game"}/>
                            <Tab label="Настройки" value={"settings"}/>
                        </Tabs>
                    </Box>
                </ThemeProvider>
                {tab === "game" && <div className={styles.game}>
                    {console.log("dsa",message?.data?.rounds)}
                    { message?.data?.rounds?.map((round, id) => {
                        console.log("round", round)
                        return <>
                            <div className={styles.header}>
                                <Typography variant="h5">Раунд {id + 1}</Typography>
                                <div className={styles.countSession}>{message?.data?.settings?.sessionCount}/{round?.sessions?.length?round?.sessions?.length:0}</div>
                            </div>
                            {round?.sessions && round?.sessions?.length >0 ? <div>

                            </div> : <div>Сессии еще не сыграны</div>}
                        </>
                    })}
                </div>
                }
            </div>
            <div className={styles.control}>
                <Button className={styles.btn}  variant={"contained"} size={"large"}>Пригласить</Button>
                <Button className={styles.btn} onClick={() => onStartGame()} sx={{minWidth:"150px"}} variant={"contained"} size={"large"}>Играть</Button>
            </div>
        </div>
    )
}

export default Lobby;