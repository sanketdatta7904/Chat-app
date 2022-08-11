import React, { useEffect, useState } from 'react'
import '../assets/sidebar.css'
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import { Avatar, IconButton } from "@mui/material"
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SidebarChat from "./SidebarChat"
import axios from '../utils/axios';
import Pusher from "pusher-js"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useStateValue } from "../context/StateProvider"

function Sidebar() {
    const [rooms, setRooms] = useState([])
    const [{ user }, dispatch] = useStateValue()
    const [input, setInput] = useState('')
    const [searched, setSearched] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/rooms/sync')
            .then(response => {
                setRooms(response.data.map(doc => ({
                    _id: doc._id,
                    name: doc.name
                })
                ))
            })
    }, [])
    useEffect(() => {
        const pusher = new Pusher('03dd74eaefa15e1b25a8', {
            cluster: 'ap2'
        });

        const channel = pusher.subscribe('rooms');
        channel.bind('inserted', function (newRoom) {
            if (newRoom.mongoEvent === "create") {
                setRooms([...rooms, newRoom])

            }
            
        });
        return () => {
            channel.unbind_all()
            channel.unsubscribe("rooms")

        }
    }, [rooms])

    const searchRoom = (e) => {
        e.preventDefault()
        console.log(input)
        for (let room of rooms) {
            if (room.name === input) {
                console.log(room)
                navigate(`/rooms/${room._id}`);
            }
        }
        setInput("")
    }

    return (
        <div className='sidebar'>
            <div className='sidebar_header'>
                <Avatar src={user?.photoURL} />
                <div className='sidebar_headerRight'>
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className='sidebar_search'>
                <div className='sidebar_searchContainer'>
                    <SearchOutlinedIcon />
                    {/* <input placeholder="Search" type="text" /> */}
                    <form action="">
                        <input value={input} onChange={e => setInput(e.target.value)} placeholder="type a message" type="text" />
                        <button onClick={searchRoom} type="submit">Search room</button>
                    </form>

                </div>
            </div>
            <div className="sidebar_chats">
                <SidebarChat addNewChat />
                {rooms.map((room, index) => (
                    <SidebarChat id={room._id} key={index} name={room.name} />
                ))}
            </div>
        </div>
    )
}

export default Sidebar
