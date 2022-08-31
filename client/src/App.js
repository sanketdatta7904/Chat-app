import "./App.css";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import { useStateValue } from "./context/StateProvider";
import { auth, onAuthStateChanged } from "./utils/firebaseSetup";
import { actionTypes } from "./context/reducer";

function App() {
  const [loggedin, setLoggedin] = useState(false);
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({
          type: actionTypes.SET_USER,
          user: user,
        });
        setLoggedin(true);
      }
    });
  }, []);

  return (
    <div className="app">
      {!loggedin ? (
        <Login />
      ) : (
        <div className="app_body">
          <Router>
            <Sidebar />
            <Routes>
              <Route path="/rooms/:roomId" element={<Chat />}></Route>
              <Route
                path="/"
                element={<h1 className="home-screen">Please select a room</h1>}
              ></Route>
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
