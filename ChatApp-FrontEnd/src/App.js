import './App.css';
import Sidebar from './Sidebar'
import Chat from './Chat'
import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js'
import axios from "./axios"
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from './Login'
import { useStateValue } from "./StateProvider"
import { actionTypes } from './reducer'

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
              <Route path="/" element={<h1>Home Screen</h1>}>

              </Route>

            </Routes>

          </Router>

        </div>

      }
    </div>
  );
}

export default App;
