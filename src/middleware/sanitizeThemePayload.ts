import { NextFunction, Request, Response } from "express";

export const sanitizeThemePayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload = req.body;
  const { layers, themeName, divider, sender_msg_color, receiver_msg_color } =
    payload;
  if (
    layers === undefined ||
    themeName === undefined ||
    divider === undefined ||
    sender_msg_color === undefined ||
    receiver_msg_color === undefined
  ) {
    return res.status(400).json({ message: "Invalid payload" });
  }
  //sanitize layers
  if (Array.isArray(layers) === false)
    return res.status(400).json({ message: "Invalid layers" });
  if (layers.length > 10) {
    return res.status(400).json({ message: "Max layers is 10" });
  }
  for (let layer in layers) {
    if (
      layer["img_url"] !== undefined ||
      layer["speed"] === undefined ||
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
    divider["max_height"] === undefined ||
    divider["color"] === undefined
  ) {
    return res.status(400).json({ message: "Invalid divider" });
  }
  next();
};
