import { AuthRoute } from "./auth.route";
import { Router } from "express";

const route = Router();

route.use("/v1", AuthRoute);

export default route;
