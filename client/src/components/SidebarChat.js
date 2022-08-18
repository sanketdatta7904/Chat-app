import React, { useEffect, useState } from 'react'
import { Avatar, IconButton } from "@mui/material"
import "../assets/SidebarChat.css"
import axios from '../utils/axios'
import { Link } from 'react-router-dom'
import { useStateValue } from "../context/StateProvider"
import ImageIcon from '@mui/icons-material/Image';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useNavigate } from 'react-router-dom';
import { actionTypes } from '../context/reducer'
import Tooltip from '@mui/material/Tooltip';



function SidebarChat({ id, name, addNewChat }) {
    const [seed, setSeed] = useState("")
    const [message, setMessage] = useState({})
    const [{ newMessage }] = useStateValue()
    const [ {}, dispatch] = useStateValue()

    const navigate = useNavigate();

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [])

    useEffect(() => {
        if (id) {
            let endPoint = '/rooms/' + id + '/lastMessage'
            axios.get(endPoint)
                .then(message => {
                    setMessage(message.data)

                })
                .catch((err) => {
                console.log(err)
                })
                

        }
    }, [id])

    useEffect(() => {
        if (newMessage) {
            if (newMessage.message.split("=")[0] === id) {
                newMessage.message = newMessage.message?.split("=")[1]
                setMessage(newMessage)
            }
        }

    }, [newMessage, id])



    const deleteRoom = async () => {
        if (id) {
            let endPoint = '/rooms/' + id
            await axios.delete(endPoint)
                .then(() => {
                    navigate(`/`);
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const changeIcon = () => {
        dispatch({
            type: actionTypes.SET_ICON,
            icon: `${id}=https://avatars.dicebear.com/api/human/${seed}.svg`
          })
    }
    return (
        <Link to={`/rooms/${id}`} onClick={changeIcon}>
            <div className="sidebarChat">
                <div className='sidebarChat_left'>
                    <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                    <div className="sidebarChat_info">
                        <h2>{name}</h2>
                        {message?.messageType === "text" ? <p>{message.name} : {message.message} </p> : (message?.messageType === "image" ? <p>{message.name} : <ImageIcon /> Photo </p> : <p></p>)}

                    </div>
                </div>
                <Tooltip title="Delete Room">
                <IconButton variant="contained" onClick={deleteRoom}>
                    <DeleteForeverOutlinedIcon  color="success" />
                </IconButton>
                </Tooltip>
            </div>
        </Link>
    ) 
}

export default SidebarChat
