import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { isAuth } from "../middleware/isAuth";

const UserRoute = Router();

UserRoute.get("/me/friends", isAuth, UserController.getFriends);
UserRoute.get(
  "/me/friend/requests/received",
  isAuth,
  UserController.getFriendRequestsReceived
);
UserRoute.post("/me/friend/request", isAuth, UserController.sendFriendRequest);
UserRoute.post("/me/friend/add", isAuth, UserController.addFriend);
UserRoute.get("/me/groups", isAuth, UserController.getGroups);
UserRoute.get("/me", isAuth, UserController.getMe);
UserRoute.get("/user", UserController.searchFriend);

export { UserRoute };
