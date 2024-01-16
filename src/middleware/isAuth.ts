import { NextFunction, Request, Response } from "express";
import { supabase } from "../helper/supabase";

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.body.accessToken;
  const supa_user = (await supabase.auth.getUser(accessToken)).data.user;
  if (supa_user != null) {
    req.user = supa_user;
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
