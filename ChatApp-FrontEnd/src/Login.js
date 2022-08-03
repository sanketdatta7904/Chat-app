import React from 'react'
import "./Login.css"
import { Button } from "@mui/material"
import { auth, provider, signInWithPopup } from "./firebaseSetup"
import { actionTypes } from './reducer'
import {useStateValue} from "./StateProvider"

function Login() {
  const [{}, dispatch] = useStateValue()
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then(result => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user
        })
      }
        
      )
      .catch(err => alert(err.message))
  }
  return (
    <div className='login'>
      <div className="login_container">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/768px-WhatsApp.svg.png" alt="" />
        <div className="login_text">
          <h1>
            Signin to whatsapp
          </h1>
        </div>
        <Button onClick={signIn}>
          Sign In with Google
        </Button>
      </div>
    </div>
  )
}

export default Login
