import { Request, Response } from "express";
import { supabase } from "../helper/supabase";

const signIn = async (req: Request, res: Response) => {
  try {
    const { data } = await supabase
      .from("User")
      .select()
      .eq("email", req.user.email);
    if (data && data?.length != 0)
      return res.status(200).json({ user: data[0] });
    else {
      const { error } = await supabase
        .from("User")
        .insert({ email: req.user.email });
      if (error) throw error;

      const result = await supabase
        .from("User")
        .select()
        .eq("email", req.user.email);
      if (result.data?.length == 0 || !result.data)
        return res.status(400).json({ message: "Error" });
      else return res.status(201).json({ user: result.data[0] });
    }
  } catch (err) {}
};
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

export const AuthController = { checkAuth, signIn };
