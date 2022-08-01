import React, { useEffect, useState } from 'react'
import './sidebar.css'
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import { Avatar, IconButton } from "@mui/material"
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SidebarChat from "./SidebarChat"
import axios from './axios';
import Pusher from "pusher-js"
import { useStateValue } from "./StateProvider"

function Sidebar() {
    const [rooms, setRooms] = useState([])
    const [{ user }, dispatch] = useStateValue()

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
            console.log("in sidebar",newRoom)
            if(newRoom.mongoEvent === "create"){
                setRooms([...rooms, newRoom])
            }
        });
        return () => {
            channel.unbind_all()
            channel.unsubscribe()
            channel.cancelSubscription()

        }
    }, [rooms])

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
                    <input placeholder="Search or Start new chat" type="text" />

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
