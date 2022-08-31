import React from "react";
import "../assets/Login.css";
import { Button } from "@mui/material";
import { auth, provider, signInWithPopup } from "../utils/firebaseSetup";
import { actionTypes } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";

function Login() {
  const [{}, dispatch] = useStateValue();
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((err) => alert(err.message));
  };
  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://cdn-icons-png.flaticon.com/512/220/220621.png"
          alt=""
        />
        <div className="login_text">
          <h1>Signin to Team Chat</h1>
        </div>
        <Button onClick={signIn}>Sign In with Google</Button>
      </div>
    </div>
  );
}

export default Login;
