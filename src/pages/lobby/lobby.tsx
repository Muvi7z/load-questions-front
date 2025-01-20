import {ComponentProps, FC} from "react";
import {useGetMessagesQuery} from "../../redux/lobbyApi/lobbyApi.ts";
import styles from "./lobby.module.scss"
import {UserDTO} from "../../redux/user/types.ts";

type LobbyPropsType = ComponentProps<"div">

const Lobby: FC<LobbyPropsType> = ({}) => {
    const {data:message, isFetching, isLoading, isSuccess} = useGetMessagesQuery()

    console.log("data", message)

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