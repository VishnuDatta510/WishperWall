import { useState, useEffect } from "react";
import { Plus, Moon, Sun, Linkedin, Github } from "lucide-react";
import { motion } from "framer-motion";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import CreateNoteModal from "../components/CreateNoteModal";
import NotesNotFound from "../components/NotesNotFound";
import { io } from "socket.io-client";
import { useInView } from "react-intersection-observer";

// Initialize socket connection
const socket = io(
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://wishperwall.onrender.com"
);

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  // Socket connection
  useEffect(() => {
    socket.on("new-note", (newNote) => {
      setNotes((prev) => [newNote, ...prev]);
      toast("New note stuck!", { icon: "📌" });
    });

    return () => {
      socket.off("new-note");
    };
  }, []);

  // Fetch notes (Initial + Pagination)
  const fetchNotes = async (pageNum) => {
    try {
      const res = await api.get(`/notes?page=${pageNum}&limit=20`);
      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setNotes((prev) => (pageNum === 1 ? res.data : [...prev, ...res.data]));
      }
    } catch (error) {
      console.log("Error fetching notes", error);
      if (error.response?.status === 429) {
        toast.error("Slow down! Too many requests. Wait a moment.", {
          duration: 5000,
          icon: "⏱️",
        });
      } else {
        toast.error("Failed to load notes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(1);
  }, []);

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1);
      fetchNotes(page + 1);
    }
  }, [inView, hasMore, loading]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      {/* Social Links & Theme Toggle */}
      <div className="fixed top-6 right-6 flex items-center gap-3 z-50">
        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/vishnudattagb/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm hover:scale-110 transition-all duration-200 group"
          aria-label="LinkedIn Profile"
        >
          <Linkedin className="size-6 text-gray-700 dark:text-gray-300 group-hover:text-[#0A66C2] transition-colors" />
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/VishnuDatta510/WishperWall"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm hover:scale-110 transition-all duration-200 group"
          aria-label="GitHub Repository"
        >
          <Github className="size-6 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        </a>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm hover:scale-110 transition-all duration-200 group"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <Moon className="size-6 text-gray-700 group-hover:text-indigo-600" />
          ) : (
            <Sun className="size-6 text-yellow-400 group-hover:text-yellow-300" />
          )}
        </button>
      </div>

      {/* Header */}
      <header className="mb-12 text-center pt-8">
        <h1 className="text-4xl md:text-6xl font-hand font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">
          WishperWall
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-sans transition-colors">
          An anonymous space for your thoughts.
        </p>
      </header>

      <div className="max-w-7xl mx-auto">
        {loading && page === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200/50 dark:bg-gray-700/50 rounded-sm animate-pulse"
              />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <NotesNotFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}

        {/* Infinite Scroll Loader */}
        {hasMore && notes.length > 0 && (
          <div ref={ref} className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-xl flex items-center justify-center z-40 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
      >
        <Plus size={32} />
      </motion.button>

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNoteCreated={() => { }} // Handled by Socket.io
      />
    </div>
  );
};

export default HomePage;

