import React, { useState, useEffect } from "react";
import RateLimitedUI from "../components/RateLimitedUI.jsx";
import NoteCard from "../components/NoteCard.jsx";
import api from "../lib/axios.js";
import { toast } from "react-hot-toast";
import {Link} from 'react-router-dom'

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log("Response" , res.data);
        setNotes(res.data.notes);
        setIsRateLimited(false);
      } catch (error) {
        console.log(error);
        if(error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  } , []);

  return (
    <div className="min-h-screen">
      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading Notes...</div>}

        {!loading && notes.length === 0 && !isRateLimited && (
          <div className="text-center text-base-content/70 py-10">
            <p className="text-xl mb-2">No notes yet!</p>
            <p>Create your first note to get started.</p>
            <br></br>
            <Link to="/create">
              <button className="btn primary-btn bg-green-600 text-black">Create a Note</button>
            </Link>
          </div>
        )}
        
        {!isRateLimited && notes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <NoteCard key={note._id} note={note} setNotes={setNotes}/>
            ))} 
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
