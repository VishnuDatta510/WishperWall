import mongoose from "mongoose";

// 1st step: You need to create a schema
// 2nd step: You would create a model based off of that schema

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
      default: "#FEF3C7", // Default light yellow
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
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      index: { expires: '0s' }, // TTL index: document is deleted when expiresAt is reached
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
