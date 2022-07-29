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

function App() {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState("sanket")



  useEffect(() => {
    axios.get('/messages/sync')
      .then(response => {
        setMessages(response.data)
      })
  }, [])



  useEffect(() => {
    const pusher = new Pusher('03dd74eaefa15e1b25a8', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function (newMessage) {
      setMessages([...messages, newMessage])
    });
    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [messages])

  return (
    <div className="app">
      {!user?
      <h1>Login</h1>  
      :
      
      <div className="app_body">
        <Router>
        <Sidebar />
          <Routes>
            <Route path="/rooms/:roomId" element={<Chat messages={messages} />}>
              
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
