import mongoose, { Schema } from "mongoose";

const { String, UUID, ObjectId } = Schema.Types;
const themeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  background: {
    type: {
      type: String,
      required: true,
      validate: {
        validator: function (val: string) {
          // string enum
          return val === "color" || val === "image" || val === "parallax";
        },
        message:
          "Background type must be either 'color', 'image' or 'parallax'",
      },
    },
    color: String,
    image: {
      url: String,
    },
    parallax: {},
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
    type: UUID,
  },
});

module.exports = mongoose.model("Theme", themeSchema);
