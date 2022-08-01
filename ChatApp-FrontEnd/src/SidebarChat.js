import React, { useEffect, useState } from 'react'
import { Avatar } from "@mui/material"
import "./SidebarChat.css"
import axios from './axios'
import { Link } from 'react-router-dom'
import { useStateValue } from "./StateProvider"



function SidebarChat({ id, name, addNewChat }) {
    const [seed, setSeed] = useState("")
    const [messages, setMessages] = useState("")

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [])

    useEffect(() => {
        if (id) {
            let endPoint = '/rooms/' + id + '/lastMessage'
            axios.get(endPoint)
                .then(message => {
                    console.log(messages, message.data)
                    setMessages(message.data)
                })

        }
    }, [id])

    const createChat = async () => {
        const roomName = prompt("Please enter name for chat");
        if (roomName) {
            await axios.post("/rooms/new", {
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
                    <p>{messages}</p>
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
