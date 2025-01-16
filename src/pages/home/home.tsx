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
    const {data, isFetching, isLoading} = useGetMessagesQuery()
   const [createLobby, ] = useCreateLobbyMutation()

    console.log("data", data, status)

    useEffect(() => {
        if(token === "" && status !== "loading") {
            navigate("/auth")
        }
    }, [])

    const onCreateLobby = () => {
        createLobby({
            type:LobbyEvents.CREATE_LOBBY,
            data: {
                userId: token
            }
        })
    }

    if (isLoading) return <div>Загрузка сообщений...</div>;
    if (isFetching) return <div>Ошибка загрузки сообщений</div>;

    return (
        <div className={styles.container}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label="basic tabs example">
                    <Tab label="Создать лобби" value="create" />
                    <Tab label="Item Two" value={"join"} />
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