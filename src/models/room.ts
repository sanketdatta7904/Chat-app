import mongoose from "mongoose";


const MessageSchema = new mongoose.Schema({
    message: String,
    name: String,
    timestamp: Date,
    messageType: String,
})
const RoomSchema = new mongoose.Schema({
    name: String,
    messages: [MessageSchema]
})


export default mongoose.model('rooms', RoomSchema)

