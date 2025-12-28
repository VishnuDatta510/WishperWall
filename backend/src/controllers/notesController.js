import Note from "../models/Note.js";
import { Filter } from "bad-words";

export async function getAllNotes(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notes = await Note.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found!" });
    res.json(note);
  } catch (error) {
    console.error("Error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content, color, expiresIn } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Profanity Filter
    const filter = new Filter();
    filter.addWords("fuck", "shit", "bitch", "asshole"); // sample words

    const cleanTitle = filter.clean(title);
    const cleanContent = filter.clean(content);

    console.log("--- CREATE NOTE DEBUG ---");
    console.log("Input Content:", content);
    console.log("Cleaned Content:", cleanContent);
    console.log("ExpiresIn received:", expiresIn);

    let expiresAt = null;
    if (expiresIn !== null && expiresIn !== undefined) {
      const hours = parseInt(expiresIn);
      expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
      console.log("Calculated Hours:", hours);
      console.log("ExpiresAt:", expiresAt);
    } else {
      console.log("Note set to never expire (forever)");
    }

    const note = new Note({
      title: cleanTitle,
      content: cleanContent,
      color,
      ...(expiresAt && { expiresAt })
    });

    const savedNote = await note.save();

    const io = req.app.get("io");
    io.emit("new-note", savedNote);

    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      {
        new: true,
      }
    );

    if (!updatedNote) return res.status(404).json({ message: "Note not found" });

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function reactToNote(req, res) {
  try {
    const { reactionType } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (!note.reactions) {
      note.reactions = new Map();
    }

    const currentCount = note.reactions.get(reactionType) || 0;
    note.reactions.set(reactionType, currentCount + 1);

    await note.save();
    res.status(200).json(note);
  } catch (error) {
    console.error("Error in reactToNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function reportNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.reports = (note.reports || 0) + 1;

    if (note.reports >= 5) {
      await Note.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Note removed due to reports" });
    }

    await note.save();
    res.status(200).json({ message: "Report submitted" });
  } catch (error) {
    console.error("Error in reportNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
