import { NextFunction, Request, Response } from "express";
import { supabase } from "../helper/supabase";

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.header("Authorization");
  const supa_user = (await supabase.auth.getUser(accessToken)).data.user;
  if (supa_user != null) {
    const { data } = await supabase
      .from("User")
      .select()
      .eq("email", supa_user.email);
    if (!data) return res.status(404).json({ message: "User not found" });

    req.user = supa_user;
    req.user.id = data[0].id;
    next();
  } else {
    console.log("Unauthorized");
    return res.status(401).json({ message: "Unauthorized" });
  }
};
