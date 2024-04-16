import { Schema, model } from "mongoose";

const { Number, String, UUID } = Schema.Types;

const EmojiSchema = new Schema({
  emojisUrl: {
    type: String,
    required: true,
  },
  sizes: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    validate: {
      validator: function (size: any) {
        if (size.width !== size.height) return false;

        return (
          size.width === 12 ||
          size.width === 16 ||
          size.width === 32 ||
          size.width === 64 ||
          size.width === 128
        );
      },
      message: "Size must be either 12, 16, 32, 64 or 128",
    },
  },
  tag: {
    type: String,
  },
  author: { type: UUID, required: true },
});

export const Emoji = model("Emoji", EmojiSchema);
