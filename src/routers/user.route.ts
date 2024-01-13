import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const UserRoute = Router();

UserRoute.get("/me/friends", UserController.getFriends);
UserRoute.get("/me/groups", UserController.getGroups);

export { UserRoute };
