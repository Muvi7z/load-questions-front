import './App.css'
import {Route, Routes} from "react-router-dom";
import Auth from "./pages/auth/auth.tsx";
import Home from "./pages/home/home.tsx";

function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  )
}

export default App
