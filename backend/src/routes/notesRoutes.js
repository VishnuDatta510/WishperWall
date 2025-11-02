import express from "express";
import { getAllNotes , createNote , updateNote , deleteNote , getNodeById} from "../controllers/notesControllers.js";
const router = express.Router();

router.get("/" ,getAllNotes);

router.post("/" ,createNote);

router.put("/:id" ,updateNote);

router.delete("/:id" ,deleteNote);

router.get("/:id" , getNodeById);

export default router; 