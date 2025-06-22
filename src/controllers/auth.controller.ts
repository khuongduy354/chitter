import { Request, Response } from "express";
import { supabase } from "../helper/supabase";

export const linkUser = async (userId: string, email: string) => {
  const { error } = await supabase
    .from("User")
    .insert({ id: userId, email: email });
  if (error) throw error;

  const result = await supabase.from("User").select().eq("email", email);
  if (result.data?.length === 0 || !result.data)
    throw new Error("Failed to create user");
  return result.data[0];
};

const signIn = async (req: Request, res: Response) => {
  try {
    const { data } = await supabase
      .from("User")
      .select()
      .eq("email", req.user.email);

    if (data && data?.length != 0) {
      return res.status(200).json({ user: data[0] });
    } else {
      const user = await linkUser(req.user.id, req.user.email);
      return res.status(201).json({ user });
    }
  } catch (err) {
    throw err;
  }
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
