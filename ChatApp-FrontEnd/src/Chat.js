import React, { useEffect, useState } from 'react'
import './chat.css'
import { Avatar, IconButton } from "@mui/material"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import axios from './axios';
import { useParams } from 'react-router-dom';




function Chat({messages}) {
    const [seed, setSeed] = useState("")
    const [input, setInput] = useState('')
    const {roomId} = useParams()
    const[roomName, setRoomName] = useState()

    useEffect(() => {
        if(roomId){
            let endPoint = "/rooms/"+roomId
            axios.get(endPoint)
            .then(response => {
                console.log(response)
                return setRoomName(response.data.name)

            }
            )
        }
    }, [roomId])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 500))

    }, [])

    const sendMessage = async (e) => {
        e.preventDefault()

        await axios.post('/messages/new', {
            name: "Sankettt",
            message: input,
            timestamp: "Just now!!!",
            received: false
        })
        setInput("")
    }
    return (
        <div className='chat'>
            <div className="chat_header">
                <Avatar src = {`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="chat_headerInfo">
                    <h3>{roomName}</h3>
                    <p>last seen at...</p>
                </div>
                <div className="chat_headerRight">
                    <IconButton>
                        <SearchOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="chat_body">
                {messages.map((message, i) => (
                    <p key = {message + JSON.stringify(Math.random()*100)}className={`chat_message ${message.received && "chat_receiver" }`}>
                    <span className="chat_name">
                        {message.name}
                    </span>
                    {message.message}
                    <span className="chat_timestamp">
                    {message.timestamp}
                    </span>

                </p>
                ))}
            </div>
            <div className="chat_footer">
                <InsertEmoticonIcon/>
                <form action="">
                    <input value={input} onChange={e=> setInput(e.target.value)} placeholder="type a message" type="text" />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <MicIcon/>
            </div>
        </div>
    )
}

export default Chat
