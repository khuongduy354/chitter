import { Request, Response } from "express";
import { supabase } from "../helper/supabase";

const getOneOneRoom = async (req: Request, res: Response) => {
  try {
    const { friendId } = req.query;
    const { data } = await supabase.rpc("query_one_one_room", {
      u1: req.user.id,
      u2: friendId,
    });
    if (data) res.status(200).json({ room: data });
    else res.status(404).json({ message: "Error" });
  } catch (err) {
    throw err;
  }
};

const getGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.query;
    const { data } = await supabase.from("Group").select("*").eq("id", groupId);
    if (data) res.status(200).json({ room: data });
    else res.status(404).json({ message: "Error" });
  } catch (err) {
    throw err;
  }
};

const joinGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.body;
    const { error } = await supabase
      .from("GroupUser")
      .insert({ group_id: groupId, user_id: req.user.id });

    if (error) res.status(404).json({ message: "Error" });
    else res.status(200).json({ message: "Joined group" });
  } catch (err) {
    throw err;
  }
};

const searchGroup = async (req: Request, res: Response) => {
  try {
    const { s } = req.query;
    const { data } = await supabase.from("Group").select("*").eq("name", s);
    if (data) res.status(200).json({ room: data });
    else res.status(404).json({ message: "No group found" });
  } catch (err) {
    throw err;
  }
};
const joinOneOneRoom = async (req: Request, res: Response) => {
  try {
    const { friendId } = req.body;

    // check room exists
    const { data: roomData } = await supabase.rpc("query_one_one_room", {
      u1: req.user.id,
      u2: friendId,
    });
    if (roomData.length > 0) return res.status(200).json({ room: roomData[0] });

    // if not joined room, join
    const { error } = await supabase
      .from("OneOneRoom")
      .insert({ user1_id: req.user.id, user2_id: friendId });
    if (error) return res.status(404).json({ message: "Error" });

    // get room just joined
    const { data: roomData2 } = await supabase.rpc("query_one_one_room", {
      u1: req.user.id,
      u2: friendId,
    });
    if (roomData2.length > 0)
      return res.status(200).json({ room: roomData2[0] });
    else res.status(404).json({ message: "Cant found room joined" });
  } catch (err) {
    throw err;
  }
};
const createGroup = async (req: Request, res: Response) => {
  try {
    const { groupName } = req.body;
    const { error } = await supabase.rpc("create_group", {
      groupname: groupName,
      admin: req.user.id,
    });

    if (!error) res.status(200).json({ room: data });
    else res.status(404).json({ message: "Error" });
  } catch (err) {
    throw err;
  }
};

export const RoomController = {
  getOneOneRoom,
  getGroup,
  joinGroup,
  joinOneOneRoom,
  createGroup,
  searchGroup,
};
