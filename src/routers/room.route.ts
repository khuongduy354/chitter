import { Router } from "express";
import { RoomController } from "../controllers/room.controller";
import { isAuth } from "../middleware/isAuth";

const RoomRoute = Router();

// RoomRoute.get("/room/oneone", isAuth, RoomController.getOneOneRoom); not needed
RoomRoute.post("/room/oneone", isAuth, RoomController.joinOneOneRoom);
RoomRoute.get("/room/groups", isAuth, RoomController.searchGroup);
RoomRoute.get("/room/groups/:id", isAuth, RoomController.getGroup);
RoomRoute.post("/room/group/join", isAuth, RoomController.joinGroup);
RoomRoute.post("/room/group/create", isAuth, RoomController.createGroup);
RoomRoute.post("/room/msg", isAuth, RoomController.getRoomMessages);

export { RoomRoute };
