import {ComponentProps, FC, useEffect} from "react";
import {JoinLobbyDTO, LobbyEvents, useGetMessagesQuery, useJoinLobbyMutation} from "../../redux/lobbyApi/lobbyApi.ts";
import styles from "./lobby.module.scss"
import {UserDTO} from "../../redux/user/types.ts";
import {useParams} from "react-router-dom";
import {useAppSelector} from "../../redux/hooks.ts";
import {setUser} from "../../redux/user/userSlice.ts";

type LobbyPropsType = ComponentProps<"div">

const Lobby: FC<LobbyPropsType> = ({}) => {
    const {data:message, error, isFetching, isLoading, isSuccess} = useGetMessagesQuery()
    const [joinLobby, {isLoading: lobbyIsLoading}] = useJoinLobbyMutation()
    const {token} = useAppSelector(state => state.user)
    const params = useParams()


        console.log(":sss", lobbyIsLoading)
    useEffect(  () => {
        console.log("reconnect")
        if(params?.lobbyId && message?.data?.id!==params?.lobbyId) {
            const userStr = localStorage.getItem('user')
            if (userStr) {
                const retrievedUser = JSON.parse(userStr);
                const dto: JoinLobbyDTO ={
                    type: LobbyEvents.JOIN_LOBBY,
                    data:{
                        lobbyId: params.lobbyId,
                        userId: retrievedUser.token
                    }
                }
                joinLobby(dto)
            }

        }

    }, [])

    console.log("data", params, error)

    return (
        <div className={styles.wrapper}>
            <div className={styles.list}>
                {message?.data?.users?.map((item: UserDTO) => {
                    return <div className={styles.list_item}>
                        <div className={styles.avatar}>{item.username[0]}</div>
                        <div className={styles.username}>{item.username}</div>
                        <div className={styles.role}>{message.data?.owner === item?.uuid? "Хост": "Игрок"}</div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Lobby;