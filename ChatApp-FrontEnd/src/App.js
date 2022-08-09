import './App.css';
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';

import Pusher from 'pusher-js'
import axios from "./utils/axios"
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from './components/Login'
import { useStateValue } from "./context/StateProvider"
import { actionTypes } from './context/reducer'

function App() {
  // const [messages, setMessages] = useState([])
  // const [user, setUser] = useState("")
  const [{ user }, dispatch] = useStateValue()

  // useEffect(() => {
  //   console.log(JSON.stringify(localStorage.getItem("user"), null, 5 ))
  //   if (localStorage.getItem("user")) {
  //     dispatch({
  //       type: actionTypes.SET_USER,
  //       user: localStorage.getItem("user")
  //     })
  //   }
  // }, [])




  return (
    <div className="app">
      {!user ?
        <Login />
        :

        <div className="app_body">
          <Router>
            <Sidebar />
            <Routes>
              <Route path="/rooms/:roomId" element={<Chat />}>

              </Route>
              <Route path="/" element={<h1 className='home-screen'>Please select a room</h1>}>

              </Route>

            </Routes>

          </Router>

        </div>

      }
    </div>
  );
}

export default App;
