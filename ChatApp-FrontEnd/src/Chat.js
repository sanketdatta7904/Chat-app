import React from 'react'
import './chat.css'
import { Avatar, IconButton } from "@mui/material"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
function Chat() {
    return (
        <div className='chat'>
            <div className="chat_header">
                <Avatar />
                <div className="chat_headerInfo">
                    <h3>Room Name</h3>
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
                <p className="chat_message">
                    <span className="chat_name">
                        sanket
                    </span>
                    this is a message
                    <span className="chat_timestamp">
                        {new Date().toUTCString()}
                    </span>

                </p>

                <p className="chat_message chat_receiver">
                    <span className="chat_name">
                        sanket
                    </span>
                    this is a message
                    <span className="chat_timestamp">
                        {new Date().toUTCString()}
                    </span>

                </p>

                <p className="chat_message">
                    <span className="chat_name">
                        sanket
                    </span>
                    this is a message
                    <span className="chat_timestamp">
                        {new Date().toUTCString()}
                    </span>
                </p>
            </div>
            <div className="chat_footer">
                <InsertEmoticonIcon/>
                <form action="">
                    <input placeholder="type a message" type="text" />
                    <button type="submit">Send a message</button>
                </form>
                <MicIcon/>
            </div>
        </div>
    )
}

export default Chat
