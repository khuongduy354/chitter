import { NextFunction, Request, Response } from "express";

const sampleTheme = {
  themeName: "sample",
  sender_msg_color: "#000000",
  receiver_msg_color: "#000000",
  bg: {
    bgColor: "#000000",
    layers: [
      {
        img_url: "https://example.com",
        speed: 1,
        translateYMin: 0,
        translateYMax: 0,
        margin: 0,
      },
    ],
    divider: {
      height: 0,
      max_height: 0,
      color: "#000000",
    },
  },
};
export const sanitizeThemePayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // general sanitize
  const { bg, themeName, sender_msg_color, receiver_msg_color } =
    req.body.theme;
  if (
    bg === undefined ||
    themeName === undefined ||
    sender_msg_color === undefined ||
    receiver_msg_color === undefined
  ) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  // sanitize bg
  const { layers, divider, bgColor } = bg;

  if (bgColor === undefined || divider === undefined || layers === undefined)
    return res.status(400).json({ message: "Invalid bg" });

  //sanitize layers
  if (Array.isArray(layers) === false)
    return res.status(400).json({ message: "Invalid layers" });
  if (layers.length > 10) {
    return res.status(400).json({ message: "Max layers is 10" });
  }
  for (let layer of layers) {
    if (
      layer["imgUrl"] === undefined ||
      layer["translateYMin"] === undefined ||
      layer["translateYMax"] === undefined ||
      layer["margin"] === undefined
    ) {
      return res.status(400).json({ message: "Invalid layer" });
    }
  }
  // sanitize divider
  if (
    divider["height"] === undefined ||
    divider["maxHeight"] === undefined ||
    divider["color"] === undefined
  ) {
    return res.status(400).json({ message: "Invalid divider" });
  }
  next();
};
