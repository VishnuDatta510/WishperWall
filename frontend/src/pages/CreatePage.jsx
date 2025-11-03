import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../lib/axios"

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Both fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", { title, content });
      toast.success("Note Created Succesfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 429) {
        toast.error("Slow Down you're creating notes too fast!", {
          duration: 4000,
        });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-base-content/70 hover:text-base-content mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Notes
        </Link>

        {/* Title */}
        <h1 className="text-3xl font-bold text-base-content mb-8">
          Create New Note
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-base-content/70 mb-2">Title</label>
            <input
              type="text"
              placeholder="Note title"
              className="w-full bg-base-200 border border-base-300 rounded-lg px-4 py-3 text-base-content focus:outline-none focus:border-primary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-base-content/70 mb-2">Content</label>
            <textarea
              placeholder="Write your note here..."
              rows="8"
              className="w-full bg-base-200 border border-base-300 rounded-lg px-4 py-3 text-base-content focus:outline-none focus:border-primary resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          {/* Create Button */}
          <div className="flex justify-end">
            <button
              className="btn btn-primary px-8"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
