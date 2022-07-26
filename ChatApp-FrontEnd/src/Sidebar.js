import React from 'react'
import './sidebar.css'
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import { Avatar, IconButton } from "@mui/material"
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SidebarChat from "./SidebarChat"


function Sidebar() {
    return (
        <div className='sidebar'>
            <div className='sidebar_header'>
                <Avatar src="https://picsum.photos/200"/>
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
                    <SearchOutlinedIcon/>
                    <input placeholder="Search or Start new chat" type="text" />

                </div>
            </div>
            <div className="sidebar_chats">
                <SidebarChat/>
                <SidebarChat/>
                <SidebarChat/>
            </div>
        </div>
    )
}

export default Sidebar
