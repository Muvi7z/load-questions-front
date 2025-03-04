import React, {useEffect, useRef, useState} from 'react';
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
    const {session, timeGame, musicPosition} = useAppSelector(state => state.session)

    const [answer, setAnswer] = useState("")
    const [timer, setTimer] = useState<number>(0)
    const [timerStart, setTimerStart] = useState<number>(3)
    const [isStartTimer, setIsStartTimer] = useState(false);
    const params = useParams()
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let intervalStart: NodeJS.Timeout
        console.log("session", message)

        if (message?.data?.settings) {
            setTimer(message.data.settings.time)
            if (session?.status === "wait") {
                intervalStart = setInterval(() => {
                    setTimerStart((prev) => {
                        if (prev - 1 <= 0) {
                            clearInterval(intervalStart)

                        }
                        return prev - 1

                    });

                }, 1000);
            }
        }

        return () => {
            console.log("close")
            clearInterval(intervalStart);
        };
    }, []);

    useEffect(() => {
        if (message?.data?.settings) {
            console.log("session?.status", session?.status)
            if (session?.status === "start"  && !isStartTimer) {
                console.log("start time session")
                setTimer(timeGame)
                startTimer()
                if (audioRef.current) {
                    console.log("audio",  musicPosition)
                    audioRef.current.currentTime = musicPosition / 1000
                }
            }
        }


    }, [session]);

    useEffect(() => {
        if (!(message?.data?.settings)) {
            if (params?.lobbyId && token) {
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
    }, [token]);

    useEffect(() => {
        if (timerStart <= 0) {
            console.log("start", timerStart)
            if (session?.status === "wait") {
                if (message?.data?.settings) {
                    console.log("start time switch")
                    startGame()
                    startTimer()
                }
            }
        }
    }, [timerStart]);

    function startTimer() {
        setIsStartTimer(true)
        const interval = setInterval(() => {
            setTimer((prev, prop) => {
                // console.log(prev)
                if (prev - 1 <= 0) {
                    console.log(":end game")
                    clearInterval(interval)
                }
                return prev - 1
            });

        }, 1000);

    }

    const togglePlayback = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div>
            {session?.status === "wait" && <div className={styles.timer}>{timerStart == 0 ? "GO" : timerStart}</div>}
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
            <audio ref={audioRef} controls={true} autoPlay={true}>
                <source src="http://192.168.1.30:10000/song" type="audio/mpeg"/>
            </audio>
        </div>
    );
};

export default Session;