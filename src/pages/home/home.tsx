import {ComponentProps, FC, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import {useNavigate} from "react-router-dom";
import {Box, Button, Tab, Tabs} from "@mui/material";
import styles from "./home.module.scss"

type HomePropsType = ComponentProps<"div">

const Home: FC<HomePropsType> = ({}) => {
    const {token} = useAppSelector(state => state.user)
    const navigate = useNavigate();
    const [tab, setTab] = useState("create")

    useEffect(() => {
        if(token === "") {
            navigate("/auth")
        }
    }, [])

    return (
        <div className={styles.container}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label="basic tabs example">
                    <Tab label="Item One" value="create" />
                    <Tab label="Item Two" value={"join"} />
                </Tabs>
            </Box>
            {tab==="create" && <div className={styles.create_lobby}>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
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