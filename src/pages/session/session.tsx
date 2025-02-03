import React, {useEffect, useState} from 'react';
import {
    LobbyEvents,
    useGetMessagesQuery, useSendMessageMutation,
    useStartGameMutation,
    useStartSessionMutation
} from "../../redux/lobbyApi/lobbyApi.ts";
import {Button, TextField} from "@mui/material";
import styles from "./session.module.scss"
import {useAppSelector} from "../../redux/hooks.ts";
import {useParams} from "react-router-dom";

const Session = () => {
    const {data: message, isSuccess} = useGetMessagesQuery()
    const [startGame,] = useStartGameMutation()
    const [sendMessage,] = useSendMessageMutation()

    const {token} = useAppSelector(state => state.user)
    const {session} = useAppSelector(state => state.session)

    const [answer, setAnswer] = useState("")
    const [timer, setTimer] = useState<number>(0)
    const [timerStart, setTimerStart] = useState<number>(3)
    const params = useParams()

    console.log("message", message)

    useEffect(() => {

    }, [message]);

    useEffect(() => {
        let intervalStart:NodeJS.Timeout
        console.log("session", message)
        if (message?.data?.settings) {
            switch (session?.status) {
                case "wait": {
                        setTimer(message.data.settings.time)
                    const intervalStart = setInterval(() => {

                        setTimerStart((prev, prop) => {
                            console.log(prev)
                            if (prev - 1 <= 0) {
                                clearInterval(intervalStart)
                                if (message?.data?.settings){
                                    startGame()
                                    startTimer()
                                }
                            }
                            return prev - 1
                        });

                    }, 1000);
                    break;
                }
                case "start":{
                    setTimer(message.data.settings.time)
                    startTimer()
                    break;
                }
                default:
                    break;
            }

        } else {
            console.log("session recon", params?.lobbyId, token)
            if(params?.lobbyId && token) {
                sendMessage({
                    type: LobbyEvents.JOIN_GAME,
                    sendBy: token,
                    data: {
                        userId: token,
                        lobbyId: params.lobbyId
                    }
                })
            }

        }
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
    }, [token]);

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
                    onClick={() => sendMessage({
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