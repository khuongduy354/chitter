import { NextFunction, Request, Response } from "express";
import { supabase } from "../helper/supabase";
import { linkUser } from "../controllers/auth.controller";

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.header("Authorization");
  const supa_user = (await supabase.auth.getUser(accessToken)).data.user;
  if (supa_user != null) {
    let { data } = await supabase
      .from("User")
      .select()
      .eq("email", supa_user.email);

    if (!data || data.length === 0) {
      // attempt to link user
      const user = await linkUser(
        supa_user.id,
        supa_user.email as string
      ).catch((err) => {
        return res.status(400).json({
          message: "Failed to link user",
          error: err.message,
        });
      });
      data = [user];
    }

    req.user = supa_user;
    req.user.id = data[0].id;
    next();
  } else {
    console.log("Unauthorized");
    return res.status(401).json({ message: "Unauthorized" });
  }
};
