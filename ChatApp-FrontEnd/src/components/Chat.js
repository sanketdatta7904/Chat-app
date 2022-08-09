import React, { useEffect, useState } from 'react'
import '../assets/chat.css'
import { Avatar, IconButton } from "@mui/material"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import axios from '../utils/axios';
import { useParams } from 'react-router-dom';
import { useStateValue } from "../context/StateProvider";
import moment from "moment";
import Pusher from "pusher-js"


function Chat() {
    const [seed, setSeed] = useState("")
    const [input, setInput] = useState('')

    const { roomId } = useParams()
    const [roomName, setRoomName] = useState()
    const [messages, setMessages] = useState([])
    const [{ user }] = useStateValue()
    // const [rooms, setRooms] = useState([])



    useEffect(() => {
        const pusher = new Pusher('03dd74eaefa15e1b25a8', {
            cluster: 'ap2'
        });

        const channel = pusher.subscribe('rooms');
        channel.bind('inserted', function (newRoom) {

            const newMessage = newRoom.messages
            if (newMessage && Object.keys(newMessage).length !== 0) {
                setMessages([...messages, newMessage])
            }
        });
        return () => {
            channel.unbind_all()
            channel.unsubscribe()
            channel.cancelSubscription()
        }
    }, [messages])

    useEffect(() => {
        if (roomId) {
            let endPoint = "/rooms/" + roomId
            axios.get(endPoint)
                .then(response => {
                    // console.log(response.data)
                    setRoomName(response.data.name)
                    setMessages(response.data.messages)
                    return

                }
                )
        }
    }, [roomId])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 500))

    }, [])

    const sendMessage = async (e) => {
        e.preventDefault()
        if (roomId) {
            // console.log(user.displayName)
            let endPoint = "/rooms/" + roomId + "/newMessage"
            // console.log(endPoint)
            // console.log(moment().utcOffset('UTC'))
            await axios.post(endPoint, {
                name: user.displayName,
                message: input,
                timestamp: moment().utcOffset('UTC'),
            })
            setInput("")
        }
    }
   
    return (
        <div className='chat'>
            <div className="chat_header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat_headerInfo">
                    <h3>{roomName}</h3>
                    <p>{"last active at "}
                        {moment(messages[messages.length - 1]?.timestamp).format('MMMM Do YYYY, h:mm:ss')}
                    </p>
                </div>
                <div className="chat_headerRight">
                    <IconButton>
                        <SearchOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        {/* <input
                            accept="image/*"
                            className="input-image"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            onChange={sendImage}
                            type="file"
                        />
                        <label htmlFor="raised-button-file"> */}
                            <AttachFileIcon />
                        {/* </label> */}
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="chat_body">
                {/* {console.log(user.displayName, ">", JSON.stringify(messages, null, 5))} */}

                {messages?.map((message, i) => {
                    return (
                        <p key={message + JSON.stringify(Math.random() * 100)} className={`chat_message ${message.name === user.displayName && "chat_receiver"}`}>
                            <span className="chat_name">
                                {message.name}
                            </span>
                            {message.message}
                            <span className="chat_timestamp">
                                {moment(message?.timestamp).format('MMMM Do YYYY, h:mm:ss')}
                            </span>

                        </p>
                    )


                })}
            </div>
            <div className="chat_footer">
                <InsertEmoticonIcon />
                <form action="">
                    <input value={input} onChange={e => setInput(e.target.value)} placeholder="type a message" type="text" />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
