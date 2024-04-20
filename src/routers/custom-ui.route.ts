import { Router } from "express";
import { CustomUIController } from "../controllers/custom-ui.controller";
import { isAuth } from "../middleware/isAuth";
import multer, { memoryStorage } from "multer";
import { sanitizeThemePayload } from "../middleware/sanitizeThemePayload";

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

// CRUD theme
// TODO: here
CustomUIRoute.post(
  "/theme",
  isAuth,
  upload.single("image"),
  // sanitizeThemePayload,
  CustomUIController.createTheme
);
// CustomUIRoute.put("/themes/:id", isAuth,upload("layers",10), CustomUIController.updateTheme); later
CustomUIRoute.delete("/themes/:id", isAuth, CustomUIController.deleteTheme);
CustomUIRoute.get("/me/themes/", CustomUIController.getMyThemes);
CustomUIRoute.get("/themes/:id", CustomUIController.getTheme);

CustomUIRoute.post(
  "/themes/:id/publish",
  isAuth,
  CustomUIController.publishTheme
);
export { CustomUIRoute };
