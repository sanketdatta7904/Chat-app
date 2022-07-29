import React, { useEffect, useState } from 'react'
import { Avatar } from "@mui/material"
import "./SidebarChat.css"
import axios from './axios'
import { Link } from 'react-router-dom'



function SidebarChat({ id, name, addNewChat }) {
    const [seed, setSeed] = useState("")
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [])


    const createChat = () => {
        const roomName = prompt("Please enter name for chat");
        if (roomName) {
            //do some stuff bruhh
            axios.post("/rooms/new", {
                name: roomName
            })
        }
    }
    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="sidebarChat_info">
                    <h2>{name}</h2>
                    <p>this is last message</p>
                </div>
            </div>
        </Link>
    ) : (
        <div onClick={createChat} className="sidebarChat">
            <h2>Add new Chat</h2>
        </div>
    )
}

export default SidebarChat
