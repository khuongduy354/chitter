import { AuthController } from "../controllers/auth.controller";
import { Router } from "express";

const AuthRoute = Router();

AuthRoute.post("/isAuth", AuthController.checkAuth);

export { AuthRoute };
