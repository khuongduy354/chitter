import { Request, Response } from "express";

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

export const UserController = { getGroups, getFriends };
