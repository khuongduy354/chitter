import { getEmojiUrlFromName, urlToBucketFileName } from "./../helper/supabase";
import uuid4 from "uuid4";
import { Request, Response } from "express";
import { supabase } from "../helper/supabase";
import { Theme } from "../helper/mongodb";

const uploadEmoji = async (req: Request, res: Response) => {
  try {
    if (req.files === null || req.files === undefined)
      return res.status(400).json({ message: "No file uploaded" });
    if (req.files.length == 0)
      return res.status(400).json({ message: "No file uploaded" });

    const filenames: string[] = [];
    await Promise.all(
      req.files?.map((file) => {
        const filename =
          req.user.id + "/" + file.originalname + "-" + uuid4().toString();
        filenames.push(filename);
        return supabase.storage
          .from("Emojis")
          .upload("Emojis/" + filename, file.buffer, {
            contentType: file.mimetype,
          })
          .then((res) => {
            const { error } = res;

            if (error) {
              //TODO: proceed to delete all inserted
              throw error;
            }
          });
      })
    );
    await Promise.all(
      filenames.map(async (filename) => {
        return supabase
          .from("Emoji")
          .insert({
            img_url: getEmojiUrlFromName(filename),
            author: req.user.id,
          })
          .then((res) => {
            const { error } = res;
            //TODO: handle atomicity here
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
    const { id } = req.params;

    //delete in static storage
    const { data } = await supabase
      .from("Emoji")
      .select()
      .eq("id", id)
      .eq("author", req.user.id);
    if (data.length === 0)
      return res.status(400).json({ message: "no file in storage" });

    const filename = urlToBucketFileName(data[0].img_url).substring(7); // delete initial Emojis/
    const { error: deleteError } = await supabase.storage
      .from("Emojis")
      .remove([filename]);
    if (deleteError) return res.status(500).json({ message: "Cant delete" });

    // delete in sql database
    const { error } = await supabase
      .from("Emoji")
      .delete()
      .eq("id", id)
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
    return res.status(200).json({ emojis: data });
  } catch (err) {
    throw err;
  }
};

const createTheme = async (req: Request, res: Response) => {
  try {
    const { bg, sender_msg_color, receiver_msg_color, themeName } =
      req.body.theme;
    const newTheme = await Theme.insertOne({
      name: themeName,
      sender_msg_color,
      receiver_msg_color,
      author: req.user.id,
      bg: {
        bgColor: bg.bgColor,
        layers: bg.layers,
        divider: bg.divider,
      },
    });
    res.status(200).json({ message: "Theme created", theme: newTheme });
  } catch (err) {
    throw err;
  }
};
const getMyThemes = async (req: Request, res: Response) => {
  try {
    const themes = Theme.find({ author: req.user.id });
    return res.status(200).json({ themes });
  } catch (err) {
    throw err;
  }
};
const getTheme = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const theme = await Theme.findOne({ _id: id });
    return res.status(200).json({ theme });
  } catch (err) {
    throw err;
  }
};
const deleteTheme = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Theme.deleteOne({ _id: id, author: req.user.id });
  } catch (err) {
    throw err;
  }
};

export const CustomUIController = {
  getMyEmojis,
  deleteEmoji,
  uploadEmoji,
  createTheme,
  getMyThemes,
  getTheme,
  deleteTheme,
};
