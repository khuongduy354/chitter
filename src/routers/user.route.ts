import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { isAuth } from "../middleware/isAuth";

const UserRoute = Router();

// friend endpoints
UserRoute.get("/me/friends", isAuth, UserController.getFriends);
UserRoute.get(
  "/me/friend/requests/received",
  isAuth,
  UserController.getFriendRequestsReceived
);
UserRoute.post("/me/friend/request", isAuth, UserController.sendFriendRequest);
UserRoute.post("/me/friend/add", isAuth, UserController.addFriend);
UserRoute.get("/user", UserController.searchFriend);

// group endpoints
UserRoute.get("/me/groups", isAuth, UserController.getMyGroups);

// user endpoints
UserRoute.get("/me", isAuth, UserController.getMe);

export { UserRoute };
