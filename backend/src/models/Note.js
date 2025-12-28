import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#FEF3C7",
    },
    reactions: {
      type: Map,
      of: Number,
      default: {},
    },
    reports: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: false,
      index: { expires: '0s' },
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
