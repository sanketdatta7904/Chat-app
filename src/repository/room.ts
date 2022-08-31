import RoomSchema from "../models/room.js";
import mongoose from "mongoose";
import * as _ from "lodash";

export class RoomRepository {
  public getRoomData = () => RoomSchema.find();

  public getLastMessage = (roomId) => {
    return RoomSchema.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(roomId) } },
      { $project: { messages: { $slice: ["$messages", -1] } } },
    ]);
  };

  public getAllMessages = (roomId) => {
    return RoomSchema.findById(roomId);
  };

  public deleteRoom = (roomId) => {
    return RoomSchema.findOneAndDelete({ _id: roomId });
  };
  public createNewRoom = (room) => {
    return RoomSchema.create(room);
  };
  public createNewMessage = (roomId, newMessage) => {
    return RoomSchema.findByIdAndUpdate(
      { _id: roomId },
      {
        $push: { messages: newMessage },
      }
    );
  };
}
