import mongoose, { Schema } from "mongoose";

const { String, UUID, ObjectId } = Schema.Types;
const backgroundSchema = new Schema({
  bgType: {
    type: String,
    required: true,
    validate: {
      validator: function (val: string) {
        // string enum
        return val === "color" || val === "image" || val === "parallax";
      },
      message: "Background type must be either 'color', 'image' or 'parallax'",
    },
  },
  color: String,
  image: {
    url: String,
  },
  parallax: {},
});

const themeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    background: {
      type: backgroundSchema,
      required: true,
      default: { bgType: "color", color: "#ffffff" },
      validate: {
        validator: function (bg: any) {
          if (bg.type === "color" && bg.color === undefined) return false;
          if (bg.type === "image" && bg.image === undefined) return false;
          if (bg.type === "parallax" && bg.parallax === undefined) return false;
          return true;
        },
        message:
          "Background type must have the correct properties corresponding to its type",
      },
    },
    messages: {
      selfMessage: {
        textColor: String,
        backgroundColor: String,
      },
      otherMessage: {
        textColor: String,
        backgroundColor: String,
      },
    },
    emojis: [
      {
        type: ObjectId,
        ref: "Emoji",
      },
    ],
    author: {
      required: true,
      type: String,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "Theme" }
);

export const Theme = mongoose.model("Theme", themeSchema);
