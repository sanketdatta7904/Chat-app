import React, { useEffect, useState } from 'react'
import '../assets/chat.css'
import { Avatar, IconButton } from "@mui/material"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import axios from '../utils/axios';
import { useParams } from 'react-router-dom';
import { useStateValue } from "../context/StateProvider";
import LogoutIcon from '@mui/icons-material/Logout';
import moment from "moment";
import Pusher from "pusher-js"
import { auth, signOut, storage, ref, uploadBytesResumable, getDownloadURL } from "../utils/firebaseSetup"
import { actionTypes } from '../context/reducer'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from "react-modal"
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';


function Chat() {
    const [seed, setSeed] = useState("")
    const [input, setInput] = useState('')

    const { roomId } = useParams()
    const [roomName, setRoomName] = useState()
    const [messages, setMessages] = useState([])
    const [{ user }] = useStateValue()
    const [{ newMessage }, dispatch] = useStateValue()
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState("")
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [uploadFinished, setUploadFinished] = useState(false)

    const handleUpload = async () => {
        if (!image) {
            return ("No image selected")
        }
        console.log("i am in handle upload")
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
                            // console.log(user.displayName)
                            let endPoint = "/rooms/" + roomId + "/newMessage"
                            // console.log(endPoint)
                            // console.log(moment().utcOffset('UTC'))
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
    const handleChange = (e) => {
        console.log("i am in handle change")


        if (e.target.files[0]) {
            setUploadFinished(false)
            setImage(e.target.files[0])
            console.log(e.target.files[0])
        }
    }
    const signOutSession = async () => {
        await signOut(auth)
            .then(result => {
                document.location.href = "/";
            }

            )
            .catch(err => alert(err.message))
    }

    // useEffect(() => {
    //     const pusher = new Pusher('03dd74eaefa15e1b25a8', {
    //         cluster: 'ap2'
    //     });

    //     const channel = pusher.subscribe('rooms');
    //     channel.bind('updated', function (newRoom) {
    //         const newMessage = newRoom.messages
    //         if (newMessage && Object.keys(newMessage).length !== 0) {
    //             setMessages([...messages, newMessage])
    //             dispatch({
    //                 type: actionTypes.NEW_MESSAGE,
    //                 newMessage: {
    //                     message: roomId + "=" + newMessage.message,
    //                     name: newMessage.name,
    //                     messageType: newMessage.messageType,
    //                     timestamp: newMessage.timestamp
    //                 }
    //             }
    //             )

    //         }

    //     });
    //     return () => {
    //         pusher.unbind_all()
    //         pusher.unsubscribe("rooms")
    //     }
    // }, [messages])

    useEffect(() => {
        console.log("i am in useeffect id details fetch")

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
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat_headerInfo">
                    <h3>{roomName}</h3>
                    <p>{"last active at "}
                        {moment(messages[messages.length - 1]?.timestamp).format('MMMM Do YYYY, h:mm:ss')}
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
                        isOpen={modalIsOpen}
                        onClose={imageUploadClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        ariaHideApp={false}
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
                                disabled={image ? false : true}
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


                    <IconButton onClick={signOutSession}>
                        <LogoutIcon />
                    </IconButton>
                </div>
            </div>
            <div className="chat_body">
                {/* {console.log(user.displayName, ">", JSON.stringify(messages, null, 5))} */}

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
