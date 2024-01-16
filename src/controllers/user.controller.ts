import { Request, Response } from "express";
import { supabase } from "../helper/supabase";

const getMe = async (req: Request, res: Response) => {
  // database query to get user
  try {
    const user = await supabase
      .from("User")
      .select("*")
      .eq("id", req.user.email);
    if (user) res.status(200).json({ user });
    else res.status(404).json({ message: "User not found" });
  } catch (err) {
    throw err;
  }
};
const getFriends = (req: Request, res: Response) => {
  try {
    let friends = [];
    res.status(200).json({ friends });
  } catch (error) {}
};

const getGroups = (req: Request, res: Response) => {
  try {
    let groups = [];
    res.status(200).json({ groups });
  } catch (error) {}
};

export const UserController = { getGroups, getFriends, getMe };
