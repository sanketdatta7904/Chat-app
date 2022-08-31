import React, { useEffect, useState } from 'react'
import '../assets/sidebar.css'
import { Avatar, IconButton } from "@mui/material"
import ChatIcon from '@mui/icons-material/Chat';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SidebarChat from "./SidebarChat"
import axios from '../utils/axios';
import Pusher from "pusher-js"
import { useNavigate } from 'react-router-dom';
import { useStateValue } from "../context/StateProvider"
import LogoutIcon from '@mui/icons-material/Logout';
import { auth, signOut } from "../utils/firebaseSetup"
import { isEmpty } from 'underscore';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import appConfig from '../config/config';

function Sidebar() {
    const [rooms, setRooms] = useState([])
    const [{ user }] = useStateValue()
    const [input, setInput] = useState('')
    const [newChat, setNewChat] = useState(false)
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
        const pusher = new Pusher(appConfig.pusherConfig.apIKey, {
            cluster: appConfig.pusherConfig.cluster
        });

        const channel = pusher.subscribe('rooms');
        channel.bind('inserted', function (newRoom) {
            if (newRoom.mongoEvent === "create") {
                setRooms([...rooms, newRoom])

            }

        });
        channel.bind('deleted', function (newRoom) {
            const filteredRooms = rooms.filter((room) => room._id !== newRoom._id)
            setRooms(filteredRooms)

        });
        return () => {
            pusher.unbind_all()
            pusher.unsubscribe("rooms")
            pusher.disconnect()

        }
    }, [rooms])
    const signOutSession = async () => {
        await signOut(auth)
            .then(result => {
                document.location.href = "/";
            }

            )
            .catch(err => alert(err.message))
    }


    // useEffect(() => { //MAnually unsubscribe
    //     const pusher = new Pusher('03dd74eaefa15e1b25a8', {
    //         cluster: 'ap2'
    //     });

    //     return () => {
    //         pusher.unbind_all()
    //         pusher.unsubscribe("rooms")
    //         pusher.disconnect()
    //     }
    // })


    const searchRoom = (e) => {
        e.preventDefault()
        for (let room of rooms) {
            if (room.name === input) {
                navigate(`/rooms/${room._id}`);
            }
        }
        setInput("")
    }
    const createChat = async (e) => {
        e.preventDefault()
        if (!isEmpty(newChatName.trim())) {
            await axios.post("/rooms/new", {
                name: newChatName
            })
            setNewChatName("")
        } else {
            alert("Please enter a name")
        }
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [newChatName, setNewChatName] = useState("")
    return (
        <div className='sidebar'>
            <div className='sidebar_header'>
                <Avatar src={user?.photoURL} alt={user?.displayName}/>
                <div className='sidebar_headerRight'>
                    <Modal
                        open={newChat}
                        onClose={() => setNewChat(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Please Enter the name of the Room
                            </Typography>
                            <form action="">
                                <input value={newChatName} onChange={e => setNewChatName(e.target.value)} placeholder="Enter Name" type="text" />
                                <button className="new_chat_submit" onClick={createChat} type="submit">Create</button>
                            </form>
                        </Box>
                    </Modal>
                    <Tooltip title="Create Room">
                        <IconButton onClick={() => setNewChat(true)}>
                            <ChatIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Sign out">

                        <IconButton onClick={signOutSession}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>

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
                {rooms.map((room, index) => (
                    <SidebarChat id={room._id} key={index} name={room.name} />
                ))}
            </div>
        </div>
    )
}

export default Sidebar
