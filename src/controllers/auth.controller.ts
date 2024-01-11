import { Request, Response } from "express";
import { supabase } from "../helper/supabase";

const getToken = (req: Request) => {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization?.split(" ")[1];
  }
  return token;
};

const checkAuth = async (req: Request, res: Response) => {
  const jwt = getToken(req);
  if (jwt === null) {
    return res.status(401).json({ message: "No Token found" });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser(jwt);

  if (user !== null) {
    return res.status(200).json({ user });
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export const AuthController = { checkAuth };
