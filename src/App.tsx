import './App.css'
import {Route, Routes} from "react-router-dom";
import Auth from "./pages/auth/auth.tsx";
import Home from "./pages/home/home.tsx";
import Lobby from "./pages/lobby/lobby.tsx";

function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/lobby/:lobbyId" element={<Lobby />} />
      </Routes>
    </>
  )
}

export default App
