import {
  getBackgroundImageUrlFromName,
  getEmojiUrlFromName,
  urlToBucketFileName,
} from "./../helper/supabase";
import uuid4 from "uuid4";
import { Request, Response } from "express";
import { supabase } from "../helper/supabase";
// import { Theme } from "../helper/mongodb";
import { Theme } from "../models/Theme.model";
import { MongooseError } from "mongoose";

const uploadEmoji = async (req: Request, res: Response) => {
  try {
    if (req.files === null || req.files === undefined)
      return res.status(400).json({ message: "No file uploaded" });
    if (req.files.length == 0)
      return res.status(400).json({ message: "No file uploaded" });

    const filenames: string[] = [];
    await Promise.all(
      req.files?.map((file: any) => {
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
    if (!data || data.length === 0)
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

// TODO: fix here
const createTheme = async (req: Request, res: Response) => {
  try {
    // sanitize
    let { themePayload } = req.body;
    themePayload = JSON.parse(themePayload);
    if (themePayload === null || themePayload === undefined)
      return res.status(400).json({ message: "No theme payload" });

    // image  upload
    if (themePayload.background.bgType === "image") {
      const file = req.file;
      if (file === undefined)
        return res.status(400).json({ message: "No image uploaded" });

      const filename =
        req.user.id + "/" + file.originalname + "-" + uuid4().toString();

      const { error } = await supabase.storage
        .from("theme")
        .upload("BackgroundImage/" + filename, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) throw error;

      themePayload.background.image = getBackgroundImageUrlFromName(filename);
    }

    // layers upload
    const newTheme = await Theme.insertMany(themePayload).catch((err) => {
      console.log("Mongo err: ", err);
    });

    res.status(201).json({ message: "Theme created", theme: newTheme });
  } catch (err) {
    if (err instanceof MongooseError) {
      return res.status(400).json({ message: err.message });
    }
    console.log(err);
    throw err;
  }
};
const getMyThemes = async (req: Request, res: Response) => {
  try {
    const myThemes = await Theme.find({ author: req.user.id });
    const boughtThemes = await Theme.find({ buyers: req.user.id });

    return res.status(200).json({ themes: [...myThemes, ...boughtThemes] });
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

const publishTheme = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const theme = await Theme.findOne({
      _id: id,
      author: req.user.id as string,
    });
    if (theme === null)
      return res.status(404).json({ message: "Theme not found" });

    theme.published = true;
    await theme.save();

    return res.status(200).json({ message: "Theme published" });
  } catch (err) {
    throw err;
  }
};

const getMarketThemes = async (req: Request, res: Response) => {
  try {
    let limit =
      req.query.limit !== undefined ? parseInt(req.query.limit as string) : 10;
    let skip =
      req.query.skip !== undefined ? parseInt(req.query.skip as string) : 0;

    const themes = await Theme.find({ published: true })
      .limit(limit)
      .skip(skip);

    console.log(themes);

    return res.status(200).json({ themes });
  } catch (err) {
    throw err;
  }
};
const downloadTheme = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const theme = await Theme.findOne({ _id: id, published: true });
    if (theme === null || theme === undefined || !theme.published)
      return res.status(404).json({ message: "Can't acquire theme" });

    await Theme.updateOne({ _id: id }, { $push: { buyers: req.user.id } });
    return res.status(200).json({ theme });
  } catch (err) {
    throw err;
  }
};

const applyTheme = async (req: Request, res: Response) => {
  // get theme
  const { id } = req.params;
  const theme = await Theme.findOne({ _id: id }).populate("buyers");
  if (theme === null || theme === undefined)
    return res.status(404).json({ message: "Theme not found" });

  // check if theme is owned or bought by me
  if (
    !theme.buyers ||
    theme.buyers === undefined ||
    !Array.isArray(theme.buyers)
  )
    return res.status(404).json({ message: "Theme not bought" });

  const isUseable =
    theme.author === req.user.id || theme.buyers.includes(req.user.id);
  if (!isUseable)
    return res.status(403).json({ message: "Theme not owned or bought" });

  // update chatroom with theme
  const { chatRoomId } = req.body;

  // apply either group or oneone room
  const { error, data: groupData } = await supabase
    .from("Group")
    .update({ theme: id })
    .eq("id", chatRoomId)
    .select()
    .single();
  if (error) {
    const { error: oneoneError, data: oneoneRoomData } = await supabase
      .from("OneOneRoom")
      .update({ theme: id })
      .eq("id", chatRoomId)
      .select()
      .single();
    if (oneoneError)
      return res.status(500).json({ message: "Can't apply theme" });

    // populate from mongo
    const oneoneTheme = await Theme.findById(oneoneRoomData.theme);

    return res
      .status(200)
      .json({ message: "Theme applied", room: oneoneTheme });
  }

  // populate from mongo
  const groupTheme = await Theme.findById(groupData.theme);

  return res.status(200).json({ message: "Theme applied", room: groupTheme });
};
export const CustomUIController = {
  getMyEmojis,
  deleteEmoji,
  uploadEmoji,
  createTheme,
  getMyThemes,
  publishTheme,
  getTheme,
  deleteTheme,
  getMarketThemes,
  downloadTheme,
  applyTheme,
};
