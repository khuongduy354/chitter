import { AuthController } from "../controllers/auth.controller";
import { Router } from "express";
import { isAuth } from "../middleware/isAuth";

const AuthRoute = Router();

// AuthRoute.post("/isAuth", AuthController.checkAuth);
AuthRoute.post("/signin", isAuth, AuthController.signIn);

export { AuthRoute };
