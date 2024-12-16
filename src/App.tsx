import { useState } from 'react'
import './App.css'
import {Route, Routes} from "react-router-dom";
import Auth from "./pages/auth/auth.tsx";

function App() {

  return (
    <>
      <Routes>
          <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  )
}

export default App
