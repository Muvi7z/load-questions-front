import {ComponentProps, FC, useEffect, useState} from "react";
import {useAppSelector} from "../../redux/hooks.ts";
import {useNavigate} from "react-router-dom";
import {Box, Button, Tab, Tabs} from "@mui/material";
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
    const {data:message, isFetching, isLoading, isSuccess} = useGetMessagesQuery()
   const [createLobby, ] = useCreateLobbyMutation()

    console.log("data", message, status)

    useEffect(() => {
        if(token === "" && status !== "loading") {
            navigate("/auth")
        }
    }, [])

    useEffect(() => {
        console.log("ss", message?.data?.id && isSuccess)
        if(message?.data?.id && isSuccess) {
            navigate(`lobby/${message?.data?.id}`)
        }
    }, [message, isSuccess]);

    const onCreateLobby = async () => {
        await createLobby({
            type:LobbyEvents.CREATE_LOBBY,
            data: {
                userId: token
            }
        })
    }


    return (
        <div className={styles.container}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label="basic tabs example">
                    <Tab label="Создать лобби" value="create" />
                    <Tab label="Присоединится в лобби" value={"join"} />
                </Tabs>
            </Box>
            {tab==="create" && <div className={styles.create_lobby}>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={() => onCreateLobby()}
                >
                    Создать лобби
                </Button>
            </div>}

            <div>

            </div>
        </div>
    )
}

export default Home