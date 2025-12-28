import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import toast from "react-hot-toast";
import useSound from "use-sound";
import { SOUNDS } from "../lib/sounds";

const COLORS = [
  { name: "yellow", value: "#FEF9C3" },
  { name: "pink", value: "#FCE7F3" },
  { name: "green", value: "#DCFCE7" },
  { name: "blue", value: "#DBEAFE" },
  { name: "purple", value: "#F3E8FF" },
  { name: "orange", value: "#FFEDD5" },
];

const CreateNoteModal = ({ isOpen, onClose, onNoteCreated }) => {
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [expiresIn, setExpiresIn] = useState("forever"); // Default forever
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playStick] = useSound(SOUNDS.stick, { volume: 0.5 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post("/notes", {
        title: "Anonymous Note",
        content,
        color: selectedColor,
        expiresIn: expiresIn === "forever" ? null : parseInt(expiresIn),
      });
      playStick();
      // onNoteCreated(res.data); // Socket will handle this now
      setContent("");
      setSelectedColor(COLORS[0].value);
      setExpiresIn("forever");
      onClose();
      toast.success("Note stuck to the wall!");
    } catch (error) {
      console.error("Error creating note:", error);
      if (error.response?.status === 429) {
        toast.error("Slow down! You're posting too fast. Wait a moment and try again.", {
          duration: 5000,
          icon: "⏱️",
        });
      } else {
        toast.error("Failed to post note");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
            className="relative w-full max-w-md h-[550px] shadow-2xl overflow-hidden p-6 flex flex-col transition-colors duration-300"
            style={{ backgroundColor: selectedColor }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:bg-black/5 rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              {/* Text Area */}
              <div className="flex-1 mt-8 mb-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  maxLength={200}
                  className="w-full h-full bg-transparent border-none resize-none focus:ring-0 outline-none text-gray-800 font-hand text-3xl placeholder-gray-500/50 leading-relaxed"
                  autoFocus
                  spellCheck="false"
                />
              </div>

              {/* Footer: Character Count, Colors, Submit */}
              <div className="mt-auto space-y-4">
                <div className="flex justify-between items-center text-sm text-gray-500 font-medium">
                  {/* Expiration Dropdown */}
                  <select
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    className="bg-black/5 border-none rounded-lg px-2 py-1 text-xs focus:ring-0 cursor-pointer outline-none"
                  >
                    <option value="forever">Forever</option>
                    <option value="24">1 Day</option>
                    <option value="72">3 Days</option>
                    <option value="168">7 Days</option>
                  </select>
                  <span>{content.length}/200</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  {/* Color Picker */}
                  <div className="flex gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-6 h-6 rounded-full border border-black/10 transition-transform ${selectedColor === color.value
                            ? "scale-125 ring-2 ring-gray-400 ring-offset-1"
                            : "hover:scale-110"
                          }`}
                        style={{ backgroundColor: color.value }}
                        aria-label={`Select ${color.name}`}
                      />
                    ))}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="px-6 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                  >
                    {isSubmitting ? "Sticking..." : "Stick It"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateNoteModal;
