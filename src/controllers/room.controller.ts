import { Request, Response } from "express";
import { supabase } from "../helper/supabase";
import { Message } from "../helper/mongodb";
import { Theme } from "../models/Theme.model";

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
    if (roomData.length > 0) {
      //popuplate
      console.log(roomData[0].theme);
      const theme = await Theme.findById(roomData[0].theme);
      roomData[0].theme = theme;

      return res.status(200).json({ room: roomData[0] });
    }

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
    if (roomData2.length > 0) {
      //popuplate
      const theme = await Theme.findById(roomData[0].theme);
      roomData2[0].theme = theme;
      return res.status(200).json({ room: roomData2[0] });
    } else res.status(404).json({ message: "Cant found room joined" });
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
// have an endpoint to get up to 100 room messages
// query from to if oneone, and to group if group, based on most recent
// socket saved to Mongodb
const getRoomMessages = async (req: Request, res: Response) => {
  try {
    const { limit: _lim } = req.query;
    const { roomId } = req.body;
    if (roomId === undefined)
      return res.status(404).json({ message: "no room id found" });
    const limit = _lim === undefined ? 20 : parseInt(_lim.toString());

    const msgs = await Message.find({ room: roomId })
      .sort({ id: -1 })
      .limit(limit)
      .toArray();
    if (msgs) res.status(200).json({ messages: msgs });
    else res.status(404).json({ message: "Error" });
  } catch (e) {
    throw e;
  }
};

export const RoomController = {
  getRoomMessages,
  getOneOneRoom,
  getGroup,
  joinGroup,
  joinOneOneRoom,
  createGroup,
  searchGroup,
};
