import React, {useEffect, useState} from 'react';
import {
    LobbyEvents,
    useGetMessagesQuery,
    useJoinGameMutation,
    useStartGameMutation,
    useStartSessionMutation
} from "../../redux/lobbyApi/lobbyApi.ts";
import {Button, TextField} from "@mui/material";
import styles from "./session.module.scss"
import {useAppSelector} from "../../redux/hooks.ts";

const Session = () => {
    const {data: message, isSuccess} = useGetMessagesQuery()
    const [startGame,] = useStartGameMutation()
    const [joinGame,] = useJoinGameMutation()

    const {token} = useAppSelector(state => state.user)

    const [answer, setAnswer] = useState("")
    const [timer, setTimer] = useState<number>(0)
    const [timerStart, setTimerStart] = useState<number>(3)

    useEffect(() => {
        if (message) {
            setTimer(message.data.settings.time)
        }

        const intervalStart = setInterval(() => {
            setTimerStart((prev, prop) => {
                console.log(prev)
                if (prev - 1 <= 0) {
                    clearInterval(intervalStart)
                    startGame()
                    startTimer()
                }
                return prev - 1
            });

        }, 1000);
        // const interval = setInterval(() => {
        //     setTimer((prev, prop) => {
        //         console.log(prev)
        //         if(prev-1 <=0) {
        //             clearInterval(interval)
        //         }
        //         return prev-1
        //     });
        //
        // }, 1000);

        return () => {
            clearInterval(intervalStart);
        };
    }, []);

    function startTimer() {

        const interval = setInterval(() => {
            setTimer((prev, prop) => {
                console.log(prev)
                if (prev - 1 <= 0) {
                    console.log(":end game")
                    clearInterval(interval)
                }
                return prev - 1
            });

        }, 1000);

    }


    return (
        <div>
            <div className={styles.timer}>{timerStart === 0 ? "GO" : timerStart}</div>
            <div className={styles.timer}>{timer}</div>
            <div>
                <TextField id="outlined-basic"
                           label="Ответ"
                           variant="outlined"
                           value={answer}
                           onChange={(event) => setAnswer(event.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={() => joinGame({
                        type: LobbyEvents.JOIN_GAME,
                        sendBy: token
                    })}
                >
                    Создать лобби
                </Button>
            </div>
        </div>
    );
};

export default Session;