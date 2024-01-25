import { Router } from "express";
import { CustomUIController } from "../controllers/custom-ui.controller";
import { isAuth } from "../middleware/isAuth";
import multer, { memoryStorage } from "multer";

const CustomUIRoute = Router();

// const storage = multer.memoryStorage()({
//   destination: (req, file, cb) => {
//     cb(null, TEMP_DIR);
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname.toLowerCase().split(" ").join("-");
//     cb(null, uuidv4() + "-" + fileName);
//   },
// });
const upload = multer({ storage: memoryStorage() });

CustomUIRoute.post(
  "/emoji",
  isAuth,
  upload.array("emoji", 10),
  CustomUIController.uploadEmoji
);
CustomUIRoute.get("/me/emojis", isAuth, CustomUIController.getMyEmojis);
CustomUIRoute.delete("/emojis/:id", isAuth, CustomUIController.deleteEmoji);

export { CustomUIRoute };
