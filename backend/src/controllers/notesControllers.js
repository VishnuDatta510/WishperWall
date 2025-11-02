import Note from "../models/Note.js";

export async function getAllNotes (_ , res) {
    try {
        const notes = await Note.find().sort({createdAt: -1})
        res.status(200).json({message:"Notes Fetched Succesfully" , notes})
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
        console.log("Error in getAllNotes Controller" ,error);
    }
}

export async function createNote (req , res) {
    try {
        const {title,content} = req.body;
        const newNote = new Note({title, content});
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (error) {
        res.error("Error in createNode controller" , error);
    }
}

export async function updateNote(req , res) {
    try {
        const {title , content} = req.body
        await Note.findByIdAndUpdate(req.params.id , {title , content})
        const updatedNote = await Note.findById(req.params.id)
        if(!updatedNote) return res.status(404).json({message:"Note Not Found!"})
        res.status(200).json({message:"Note Updated Successfully" , updatedNote})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
        console.log("Error in updateNode Controller", error);
    }
}

export async function deleteNote (req , res) {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if(!deletedNote) return res.status(404).json({message : "Note Doenst Exist"});
        res.status(200).json({message :"Deleted Note Succesfully"});
    } catch (error) {
        res.status(500).json({message : "Internal server error" , error});
        console.log("error in deleteNode Controller" , error);     
    }
}

export async function getNodeById(req , res) {
    try {
        const specificNote = await Note.findById(req.params.id);
        if(!specificNote) return res.status(404).json({message : "Note not found!"});
        res.status(200).json(specificNote);
    } catch (error) {
        res.status(500).json({message : "Internal server error"});
        console.log(error);
    }
}

