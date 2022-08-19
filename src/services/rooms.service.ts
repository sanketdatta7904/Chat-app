import { RoomRepository } from "../repository/room.js"
import _ from "lodash"

export class RoomsService{

    public getRooms = async() => {
        try{
            let rooms = await new RoomRepository().getRoomData()
            return rooms
        }
        catch(err){

        }
    }
    public deleteRoom = async(roomId) => {
        try{
            let rooms = await new RoomRepository().deleteRoom(roomId)
            return
        }
        catch(err){

        }
    }
    public getLastMessage = async(roomId) => {
        try{
            let lastMessage = await new RoomRepository().getLastMessage(roomId)
            return _.get(lastMessage, [0, "messages", 0], {})
        }
        catch(err){

        }
    }
    public getAllMessages = async(roomId) => {
        try{
            const messagesList = await new RoomRepository().getAllMessages(roomId)
            return messagesList
        }
        catch(err){

        }
    }
    public createRoom = async(room) => {
        try{
            const createRoom = await new RoomRepository().createNewRoom(room)
            return
        }
        catch(err){

        }
    }
    public createNewMessage = async(roomId, newMessage) => {
        try{
            const createRoom = await new RoomRepository().createNewMessage(roomId, newMessage)
            return
        }
        catch(err){

        }
    }


}