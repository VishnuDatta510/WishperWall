import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
  reactToNote,
  reportNote,
} from "../controllers/notesController.js";

const router = express.Router();

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
// router.delete("/:id", deleteNote); // Disabled public delete
router.put("/:id/react", reactToNote);
router.post("/:id/report", reportNote);

export default router;
