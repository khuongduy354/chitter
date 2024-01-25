import uuid4 from "uuid4";
import { Request, Response } from "express";
import { supabase } from "../helper/supabase";

const uploadEmoji = async (req: Request, res: Response) => {
  try {
    if (req.files === null || req.files === undefined)
      return res.status(400).json({ message: "No file uploaded" });
    if (req.files.length == 0)
      return res.status(400).json({ message: "No file uploaded" });

    await Promise.all(
      req.files?.map((file) => {
        console.log(file);
        const blob = new Blob(file.buffer);
        return supabase.storage
          .from("Emojis")
          .upload(
            "Emojis/" +
              req.user.id +
              "/" +
              file.originalname +
              uuid4().toString() +
              file.buffer,
            {
              contentType: file.mimetype,
            }
          )
          .then((res) => {
            const { error } = res;
            console.log(error);
            if (error) throw error;
          });
      })
    );
    res.status(200).json({ message: "Files uploaded" });
  } catch (err) {
    res.status(400).json({ message: "Files uploaded unsuccessfully" });
    console.log(err);
    throw err;
  }
};
const deleteEmoji = async (req: Request, res: Response) => {
  try {
    const { emojiId } = req.body;
    const { error } = await supabase
      .from("Emoji")
      .delete()
      .eq("id", emojiId)
      .eq("author", req.user.id);

    //TODO: check if owner
    if (error) throw error;
    return res.status(200).json({ message: "Emoji deleted" });
  } catch (err) {
    throw err;
  }
};
const getMyEmojis = async (req: Request, res: Response) => {
  try {
    const { data } = await supabase
      .from("Emoji")
      .select()
      .eq("author", req.user.id);
    console.log(data);
    return res.status(200).json({ emojis: data });
  } catch (err) {
    throw err;
  }
};
export const CustomUIController = { getMyEmojis, deleteEmoji, uploadEmoji };
