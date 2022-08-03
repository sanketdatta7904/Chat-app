import React, { useEffect, useState } from 'react'
import { Avatar } from "@mui/material"
import "./SidebarChat.css"
import axios from './axios'
import { Link } from 'react-router-dom'
import { useStateValue } from "./StateProvider"
import Pusher from "pusher-js"



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
                    setMessages([message.data])
                })

        }
    }, [id])
    
    useEffect(() => {
        const pusher = new Pusher('03dd74eaefa15e1b25a8', {
            cluster: 'ap2'
        });

        const channel = pusher.subscribe('rooms');
        channel.bind('inserted', function (newRoom) {

            const newMessage = newRoom.messages
            if(newMessage && newRoom._id == id){
                setMessages(newMessage.message)
            }
        });
        return () => {
            channel.unbind_all()
            channel.unsubscribe()
            channel.cancelSubscription()
        }
    }, [])


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
