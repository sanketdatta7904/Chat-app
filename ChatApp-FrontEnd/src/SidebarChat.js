import React from 'react'
import { Avatar } from "@mui/material"
import "./SidebarChat.css"



function SidebarChat() {
    return (
        <div className="sidebarChat">
            <Avatar />
            <div className="sidebarChat_info">
                <h2>Room Name</h2>
                <p>this is last message</p>
            </div>
        </div>
    )
}

export default SidebarChat
