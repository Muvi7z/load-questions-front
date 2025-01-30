import React, {useEffect, useState} from 'react';
import {useGetMessagesQuery} from "../../redux/lobbyApi/lobbyApi.ts";
import {TextField} from "@mui/material";
import styles from "./session.module.scss"

const Session = () => {
    const {data: message, isSuccess} = useGetMessagesQuery()
    const [answer, setAnswer] = useState("")
    const [timer, setTimer] = useState<number>(0)
    console.log(message)

    useEffect(() => {
        if(message) {

            setTimer(message.data.settings.time)
        }
        const interval = setInterval(() => {
            setTimer((prev, prop) => {
                return prev-1
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);


    return (
        <div>
            <div className={styles.timer}>{timer}</div>
            <div>
                <TextField id="outlined-basic"
                           label="Ответ"
                           variant="outlined"
                           value={answer}
                           onChange={(event) => setAnswer(event.target.value)}
                />
            </div>
        </div>
    );
};

export default Session;