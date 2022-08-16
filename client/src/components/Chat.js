import React, { useEffect, useState } from 'react'
import '../assets/chat.css'
import { Avatar, IconButton } from "@mui/material"
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import axios from '../utils/axios';
import { useParams } from 'react-router-dom';
import { useStateValue } from "../context/StateProvider";
import moment from "moment";
import {storage, ref, uploadBytesResumable, getDownloadURL } from "../utils/firebaseSetup"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Picker from 'emoji-picker-react';
import Tooltip from '@mui/material/Tooltip';
import Pusher from "pusher-js"
import {actionTypes} from "../context/reducer"
import appConfig from '../config/config';


function Chat() {
    const [input, setInput] = useState('')

    const { roomId } = useParams()
    const [roomName, setRoomName] = useState()
    const [messages, setMessages] = useState([])
    const [{ user }] = useStateValue()
    const [{ icon }] = useStateValue()
    const [{  }, dispatch] = useStateValue()

    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState("")
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [uploadFinished, setUploadFinished] = useState(false)
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [emojiOpen, setEmojiOpen] = useState(false)



    const handleUpload = async () => {
        if (!image) {
            return ("No image selected")
        }
        const storageRef = ref(storage, `images/${image.name}`)
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            (err) => {
                console.log(err)
                alert(err.message)
                setProgress(0)
                setImage("")
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(async url => {
                        setUploadFinished(true)
                        if (roomId) {
                            let endPoint = "/rooms/" + roomId + "/newMessage"
                            await axios.post(endPoint, {
                                name: user.displayName,
                                message: url,
                                timestamp: moment().utcOffset('UTC'),
                                messageType: "image"
                            })
                            setProgress(0)
                            setImage("")
                        }
                    })
            }
        )

    }

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        setInput(input + emojiObject.emoji)
    };

    const handleChange = (e) => {
        if (e.target.files[0] ) {
            if(e.target.files[0].type.includes("image") && (e.target.files[0].size)/1024 <=1026){
                setUploadFinished(false)
                setImage(e.target.files[0])
            }else{
                alert("Please select image file of 1MB size only")
            }
           
        }
    }
  

    useEffect(() => {
        const pusher = new Pusher(appConfig.pusherConfig.apIKey, {
            cluster: appConfig.pusherConfig.cluster
        });

        const channel = pusher.subscribe('rooms');
        channel.bind('updated', function (newRoom) {
            const newMessage = newRoom.messages
            if (newMessage && Object.keys(newMessage).length !== 0) {
                setMessages([...messages, newMessage])
                dispatch({
                    type: actionTypes.NEW_MESSAGE,
                    newMessage: {
                        message: roomId + "=" + newMessage.message,
                        name: newMessage.name,
                        messageType: newMessage.messageType,
                        timestamp: newMessage.timestamp
                    }
                }
                )

            }

        });
        return () => {
            pusher.unbind_all()
            pusher.unsubscribe("rooms")
        }
    }, [messages])

    useEffect(() => {

        if (roomId) {
            let endPoint = "/rooms/" + roomId
            axios.get(endPoint)
                .then(response => {
                    setRoomName(response.data.name)
                    setMessages(response.data.messages)
                    return

                }
                )
        }
    }, [roomId])


    const sendMessage = async (e) => {

        e.preventDefault()
        if (roomId) {
            let endPoint = "/rooms/" + roomId + "/newMessage"
            await axios.post(endPoint, {
                name: user.displayName,
                message: input,
                timestamp: moment().utcOffset('UTC'),
                messageType: "text"
            })
            setInput("")
        }
    }
    const imageUploadClose = () => {
        setImage("")
        setProgress(0)
        setModalIsOpen(false)
    }
    const lastMessageTimestamp = (messages) => {
        if(messages && messages.length === 0){
            return moment().format('MMMM Do YYYY, h:mm:ss')
        }else{
            return  moment(messages[messages.length - 1]?.timestamp).format('MMMM Do YYYY, h:mm:ss')
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
    return (
        <div className='chat'>
            <div className="chat_header">
                <Avatar src={icon?.split("=")[1]} />
                <div className="chat_headerInfo">
                    <h3>{roomName}</h3>
                    <p>{"last active at "}
                        {lastMessageTimestamp(messages)}
                    </p>
                </div>
                <div className="chat_headerRight">
                    <Button
                        variant="contained"
                        component="label"
                        onClick={() => setModalIsOpen(true)}
                    >
                        Send Image
                    </Button>

                    <Modal
                        open={modalIsOpen}
                        onClose={imageUploadClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Please Upload an Image
                            </Typography>
                            <LinearProgress variant="determinate" value={progress} />
                            <IconButton >
                                <input
                                    accept="image/*"
                                    className="input-image"
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    onChange={handleChange}
                                    type="file"
                                />
                                <label htmlFor="raised-button-file">
                                    <AttachFileIcon />
                                </label>
                            </IconButton>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                {image ? image.name : ""}
                            </Typography>
                            <Button
                                variant="contained"
                                component="label"
                                onClick={handleUpload}
                                disabled={image && (progress=== 0) ? false : true}
                            >
                                Upload
                            </Button>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                {uploadFinished ? "Upload finished Successfully" : ""}
                            </Typography>
                            <div>
                                <button onClick={imageUploadClose}>Close</button>
                            </div>
                        </Box>
                    </Modal>


                </div>
            </div>
            <div className="chat_body">

                {messages?.map((message, i) => {
                    if (message.messageType === "text") {
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
                    } else {
                        return (
                            <div key={message.message + JSON.stringify(Math.random() * 100)} className={`chat_message ${message.name === user.displayName && "chat_receiver"}`}>
                                <span className="chat_name">
                                    {message.name}
                                </span>
                                <Card sx={{ maxWidth: 345 }} className="chat_image">
                                    <CardMedia
                                        component="img"
                                        height="194"
                                        image={message.message}
                                        alt="Paella dish"
                                    />
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                            {moment(message?.timestamp).format('MMMM Do YYYY, h:mm:ss')}
                                        </Typography>
                                    </CardContent>


                                </Card>
                            </div>

                        )
                    }



                })}
            </div>
            <div className="chat_footer">
            <Tooltip title="Send Emoji">

                <InsertEmoticonIcon onClick={() => setEmojiOpen(true)} />
                </Tooltip>

                <Modal
                    open={emojiOpen}
                    onClose={() => setEmojiOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"

                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Text in a modal
                        </Typography>
                        {chosenEmoji ? (
                            <span>You chose: {chosenEmoji.emoji}</span>
                        ) : (
                            <span>No emoji Chosen</span>
                        )}
                        <Picker onEmojiClick={onEmojiClick} />
                        <button onClick={() => setEmojiOpen(false)}>close</button>
                    </Box>
                    
                </Modal>
                <form action="">
                    <input value={input} onChange={e => setInput(e.target.value)} placeholder="type a message" type="text" />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
            </div>
        </div>
    )
}

export default Chat
