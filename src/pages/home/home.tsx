import {ComponentProps, FC, useEffect, useState} from "react";
import {useAppSelector} from "../../redux/hooks.ts";
import {useNavigate} from "react-router-dom";
import {Box, Button, Tab, Tabs, TextField} from "@mui/material";
import styles from "./home.module.scss"
import {
    LobbyEvents,
    useCreateLobbyMutation,
    useGetMessagesQuery,
} from "../../redux/lobbyApi/lobbyApi.ts";

type HomePropsType = ComponentProps<"div">

const Home: FC<HomePropsType> = ({}) => {
    const {token, status} = useAppSelector(state => state.user)
    const navigate = useNavigate();
    const [tab, setTab] = useState("create")
    const {data: message, isSuccess} = useGetMessagesQuery()
    const [createLobby,] = useCreateLobbyMutation()
    const [lobbyId, setLobbyId] = useState("")

    console.log("data", message, status)

    useEffect(() => {
        if (message?.data?.id && isSuccess) {
            navigate(`lobby/${message?.data?.id}`)
        }
    }, [message, isSuccess]);

    const onCreateLobby = async () => {
        await createLobby({
            type: LobbyEvents.CREATE_LOBBY,
            data: {
                userId: token
            }
        })
    }


    return (
        <div className={styles.container}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{
                    userSelect:"none"
                }} aria-label="basic tabs example">
                    <Tab label="Создать лобби" value="create"/>
                    <Tab label="Присоединится в лобби" value={"join"}/>
                </Tabs>
            </Box>
            {tab === "create" && <div className={styles.createLobby}>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={() => onCreateLobby()}
                >
                    Создать лобби
                </Button>
            </div>}

            {tab === "join" && <div className={styles.joinLobby}>
                <TextField  id="outlined-basic" label="Идентификатор лобби" variant="outlined" value={lobbyId} onChange={(event) => setLobbyId(event.target.value)}/>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={() => onCreateLobby()}
                >
                    Присоединится в лобби
                </Button>
            </div>}
        </div>
    )
}

export default Home