import React from 'react'
import "./Login.css"
import { Button } from "@mui/material"
function Login() {
    const signIn = ()=> {
        
    }
  return (
    <div className='login'>
      <div className="login_container">
        <img src="https://upload.wikimedia.org/wikipeia" alt="" />
        <div className="login_text">
            <h1>
                Signin to whatsapp
            </h1>
        </div>
        <Button  onClick={signIn}>
            Sign In with Google
        </Button>
      </div>
    </div>
  )
}

export default Login
