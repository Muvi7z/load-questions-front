import {ComponentProps, FC} from "react";
import {useGetMessagesQuery} from "../../redux/lobbyApi/lobbyApi.ts";
import styles from "./lobby.module.scss"

type LobbyPropsType = ComponentProps<"div">

const Lobby: FC<LobbyPropsType> = ({}) => {
    const {data, isFetching, isLoading, isSuccess} = useGetMessagesQuery()

    console.log("data", data)

    return (
        <div className={styles.wrapper}>
            <div className={styles.list}>
                {data?.users?.map((item) => {
                    return <div className={styles.list_item}>
                        <div className={styles.avatar}>{item.username[0]}</div>
                        <div className={styles.username}>{item.username}</div>
                        <div className={styles.role}>{data?.owner === item?.uuid? "Хост": "Игрок"}</div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Lobby;