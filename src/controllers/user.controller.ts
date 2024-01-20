import { Request, Response } from "express";
import { supabase } from "../helper/supabase";

const searchFriend = async (req: Request, res: Response) => {
  try {
    const email = req.query.s;
    const { data } = await supabase.from("User").select().eq("email", email);
    if (data) res.status(200).json({ user: data[0] });
    else res.status(404).json({ message: "User not found" });
  } catch (err) {
    throw err;
  }
};
const addFriend = async (req: Request, res: Response) => {
  try {
    // check if request is available
    const { friendId } = req.body;
    const { data: reqData } = await supabase
      .from("FriendRequest")
      .select()
      .eq("to", req.user.id)
      .eq("from", friendId);

    if (reqData) {
      // add friend
      const { friendId } = req.body;
      const { error } = await supabase
        .from("Friend")
        .insert({ user1_id: req.user.id, user2_id: friendId });

      if (error) res.status(404).json({ message: "Cannot add friend" });
      else {
        //  try to delete request
        const { error } = await supabase
          .from("FriendRequest")
          .delete()
          .eq("to", req.user.id)
          .eq("from", friendId);

        if (error)
          res.status(404).json({ message: "Cannot delete friend request" });
        else res.status(200).json({ message: "Friend added" });
      }
    } else {
      res.status(404).json({ message: "Friend request not found" });
    }
  } catch (err) {
    throw err;
  }
};
const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const { friendId } = req.body;
    // check user exists
    const { data: userData } = await supabase
      .from("User")
      .select()
      .eq("id", friendId);
    if (!userData) return res.status(404).json({ message: "User not found" });

    const { error } = await supabase
      .from("FriendRequest")
      .insert({ from: req.user.id, to: friendId });
    if (error) res.status(404).json({ message: "User not found" });
    else res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    throw err;
  }
};
const getFriendRequestsReceived = async (req: Request, res: Response) => {
  try {
    const { data } = await supabase
      .from("FriendRequest")
      .select()
      .eq("to", req.user.id);
    if (data) res.status(200).json({ friendRequests: data });
    else res.status(404).json({ message: "Error" });
  } catch (err) {
    throw err;
  }
};
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
const getFriends = async (req: Request, res: Response) => {
  try {
    const { data } = await supabase.rpc("query_friend", {
      email: req.user.email,
    });
    console.log(data);
    if (data) res.status(200).json({ friends: data });
    else res.status(404).json({ message: "Error" });
  } catch (error) {}
};

const getGroups = (req: Request, res: Response) => {
  try {
    let groups = [];
    res.status(200).json({ groups });
  } catch (error) {}
};

export const UserController = {
  getGroups,
  getFriends,
  getMe,
  searchFriend,
  addFriend,
  getFriendRequestsReceived,
  sendFriendRequest,
};
