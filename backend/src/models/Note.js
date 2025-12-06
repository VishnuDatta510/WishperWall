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
      required: false, // Optional - null means note never expires
      index: { expires: '0s' }, // TTL index: document is deleted when expiresAt is reached (only if set)
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
