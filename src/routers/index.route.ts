import { AuthRoute } from "./auth.route";
import { UserRoute } from "./user.route";
import { Router } from "express";

const route = Router();

route.use("/v1", AuthRoute);
route.use("/v1", UserRoute);

export default route;
