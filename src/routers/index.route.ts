import { AuthRoute } from "./auth.route";
import { CustomUIRoute } from "./custom-ui.route";
import { RoomRoute } from "./room.route";
import { UserRoute } from "./user.route";
import { Router } from "express";

const route = Router();

route.use("/v1", AuthRoute);
route.use("/v1", UserRoute);
route.use("/v1", RoomRoute);
route.use("/v1", CustomUIRoute);

export default route;
