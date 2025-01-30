import './App.css'
import {Route, Routes, useNavigate} from "react-router-dom";
import Auth from "./pages/auth/auth.tsx";
import Home from "./pages/home/home.tsx";
import Lobby from "./pages/lobby/lobby.tsx";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "./redux/hooks.ts";
import {setUser} from "./redux/user/userSlice.ts";
import {getUser} from "./api/requests/user.ts";
import {createTheme, ThemeProvider} from "@mui/material";
import Session from "./pages/session/session.tsx";

function App() {
    const {token, status} = useAppSelector(state => state.user)
    const navigate = useNavigate();
    const dispatch = useAppDispatch()

    useEffect(() => {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            const retrievedUser = JSON.parse(userStr);
            getUser(retrievedUser.token).then(r => {
                if (r) {
                    dispatch(setUser(retrievedUser))
                }
            }).catch((err) => {
                console.log("error",err)
                if(err?.status === 404) {
                    if (err?.response?.data?.error === "user not found") {
                        localStorage.removeItem('user')
                        navigate("/auth")
                    }
                }
            })
        }  if (token === "" && status !== "loading") {
            navigate("/auth")
        }
    }, [])

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

  return (
    <>
     <ThemeProvider theme={darkTheme} >
         <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/auth" element={<Auth />} />
             <Route path="/lobby/:lobbyId" element={<Lobby />} />
             <Route path="/session/:sessionId" element={<Session />} />
         </Routes>
     </ThemeProvider>
    </>
  )
}

export default App
