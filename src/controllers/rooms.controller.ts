import { Router } from "express";
import { RoomsService } from "../services/rooms.service.js";
export class ChatAppController {
  public static route = "/v1";
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  public init() {
    this.router.get("/rooms/sync", this.getRooms);
    this.router.get("/rooms/:roomId/lastMessage", this.getLastMessage);
    this.router.get("/rooms/:roomId", this.getAllMessages);
    this.router.post("/rooms/new", this.createRoom);
    this.router.post("/rooms/:roomId/newMessage", this.createNewMessage);
    this.router.delete("/rooms/:roomId", this.deleteRoom);
  }

  private getRooms = async (request, response, next) => {
    try {
      const res = await new RoomsService().getRooms();
      response.status(200).send(res);
    } catch (error) {
      response.status(500).send(error);
    }
  };
  private deleteRoom = async (request, response, next) => {
    try {
      const roomId = request.params.roomId;
      const res = await new RoomsService().deleteRoom(roomId);
      response.status(200).send(res);
    } catch (error) {
      response.status(500).send(error);
    }
  };
  private getLastMessage = async (request, response, next) => {
    try {
      const roomId = request.params.roomId;
      const res = await new RoomsService().getLastMessage(roomId);
      response.status(200).send(res);
    } catch (error) {
      response.status(500).send(error);
    }
  };
  private getAllMessages = async (request, response, next) => {
    try {
      const roomId = request.params.roomId;
      const res = await new RoomsService().getAllMessages(roomId);
      response.status(200).send(res);
    } catch (error) {
      response.status(500).send(error);
    }
  };

  private createRoom = async (request, response, next) => {
    try {
      const room = request.body;
      const res = await new RoomsService().createRoom(room);
      response.status(200).send(res);
    } catch (error) {
      response.status(500).send(error);
    }
  };
  private createNewMessage = async (request, response, next) => {
    try {
      const roomId = request.params.roomId;
      const newMessage = request.body;
      const res = await new RoomsService().createNewMessage(roomId, newMessage);
      response.status(200).send(res);
    } catch (error) {
      response.status(500).send(error);
    }
  };
}
