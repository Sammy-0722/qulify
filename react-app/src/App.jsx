import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import User1 from "./components/user";
import Admin from "./components/Admin"
import Landingpage from "./components/landingpage";
import Login from "./components/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<User1 />} />
        <Route path="/admin" element=
        {
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
          }/>
      </Routes>
    </Router>
  )
}

export default App;