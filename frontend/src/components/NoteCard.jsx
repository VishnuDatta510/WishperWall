import { Trash2Icon, Share2, Flag, Download } from "lucide-react";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useRef } from "react";
import useSound from "use-sound";
import html2canvas from "html2canvas";
import { SOUNDS } from "../lib/sounds";

const STICKERS = ["🔥", "❤️", "⭐", "😂", "😢"];

const NoteCard = ({ note, setNotes }) => {
  const [playPop] = useSound(SOUNDS.pop, { volume: 0.5 });
  const [playCrumple] = useSound(SOUNDS.crumple, { volume: 0.5 });
  
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [reactions, setReactions] = useState(note.reactions || {});
  
  // Generate random rotation between -3 and 3 degrees once on mount
  const rotation = useMemo(() => Math.random() * 6 - 3, []);

  // Calculate freshness
  const { isAged, isFresh } = useMemo(() => {
    const created = new Date(note.createdAt);
    const now = new Date();
    const ageHours = (now - created) / (1000 * 60 * 60);
    return {
      isAged: ageHours > 72, // Older than 3 days
      isFresh: ageHours < 1  // Newer than 1 hour
    };
  }, [note.createdAt]);

  // Calculate time left (Dynamic based on expiresAt)
  const timeLeft = useMemo(() => {
    if (!note.expiresAt) return "24h left"; // Fallback for old notes
    
    const expiresAt = new Date(note.expiresAt);
    const now = new Date();
    const diff = expiresAt - now;
    
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  }, [note.expiresAt, note.createdAt]);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    playCrumple();
    try {
      await api.delete(`/notes/${note._id}`);
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
      toast.success("Note removed");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete note");
    }
  };

  const handleReaction = async (sticker) => {
    // Check if already reacted to this sticker for this note
    const storageKey = `reacted-${note._id}-${sticker}`;
    if (localStorage.getItem(storageKey)) {
      toast.error("You already reacted with this!");
      return;
    }

    playPop();
    // Optimistic update
    setReactions(prev => ({
      ...prev,
      [sticker]: (prev[sticker] || 0) + 1
    }));

    // Mark as reacted locally
    localStorage.setItem(storageKey, "true");

    try {
      await api.put(`/notes/${note._id}/react`, { reactionType: sticker });
    } catch (error) {
      console.error("Failed to react", error);
      // Revert on error
      setReactions(prev => ({
        ...prev,
        [sticker]: (prev[sticker] || 0) - 1
      }));
      localStorage.removeItem(storageKey);
    }
  };

  const handleReport = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Report this note as inappropriate?")) return;

    try {
      await api.post(`/notes/${note._id}/report`);
      toast.success("Report submitted. Thank you.");
    } catch (error) {
      toast.error("Failed to report");
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    if (!cardRef.current) return;

    try {
      // Temporarily remove transform for clean capture
      const originalTransform = cardRef.current.style.transform;
      cardRef.current.style.transform = "none";

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true, // Enable CORS for images
        logging: false,
      });
      
      // Restore transform
      cardRef.current.style.transform = originalTransform;
      
      const link = document.createElement("a");
      link.download = `wishper-note-${note._id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Note saved as image!");
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to share note");
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      whileHover={{ 
        scale: 1.05, 
        rotate: 0, 
        zIndex: 10,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
      }}
      onHoverStart={() => {
        setIsHovered(true);
        playPop();
      }}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative p-6 aspect-square flex flex-col justify-between shadow-md transition-shadow cursor-default group ${
        isAged ? "opacity-80 sepia-[.3]" : ""
      }`}
      style={{ backgroundColor: note.color || "#FEF9C3" }}
    >
      {/* Pin/Tape effect */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black/10 blur-[1px]" />

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <p className="font-hand text-xl text-gray-800 leading-relaxed break-all overflow-wrap-anywhere">
          {note.content}
        </p>
      </div>

      {/* Stickers Display */}
      <div className="flex flex-wrap gap-1 mt-2 min-h-[24px]">
        {Object.entries(reactions).map(([sticker, count]) => (
          count > 0 && (
            <div key={sticker} className="flex items-center bg-black/5 rounded-full px-1.5 py-0.5 text-xs">
              <span>{sticker}</span>
              <span className="ml-1 font-bold text-gray-600">{count}</span>
            </div>
          )
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-end mt-2 pt-2 border-t border-black/5">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500/60 font-sans">
            {formatDate(new Date(note.createdAt))}
          </span>
          <span className="text-[10px] font-medium text-red-400/60 font-sans">
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Hover Actions Overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/0 flex flex-col justify-between p-4 pointer-events-none"
          >
            {/* Top Actions */}
            <div className="flex justify-end gap-2 pointer-events-auto">
              <button
                onClick={handleShare}
                className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm text-gray-600 hover:text-blue-500 transition-colors"
                title="Save as Image"
              >
                <Download size={16} />
              </button>
              <button
                onClick={handleReport}
                className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm text-gray-600 hover:text-red-500 transition-colors"
                title="Report"
              >
                <Flag size={16} />
              </button>
              {/* Delete button removed as requested */}
            </div>

            {/* Bottom Sticker Picker */}
            <div className="flex justify-center gap-2 pointer-events-auto pb-2">
              <div className="flex gap-1 bg-white/90 p-1.5 rounded-full shadow-lg backdrop-blur-sm">
                {STICKERS.map((sticker) => (
                  <button
                    key={sticker}
                    onClick={() => handleReaction(sticker)}
                    className="hover:scale-125 transition-transform p-1"
                  >
                    {sticker}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NoteCard;
