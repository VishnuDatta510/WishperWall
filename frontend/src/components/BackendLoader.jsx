import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../lib/axios";

const BackendLoader = ({ children }) => {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Try to ping the backend - using the notes endpoint since it already exists
        await api.get("/notes?page=1&limit=1");
        setIsBackendReady(true);
      } catch (error) {
        // If it fails, retry after 3 seconds
        setRetryCount((prev) => prev + 1);
        setTimeout(checkBackend, 3000);
      }
    };

    checkBackend();
  }, []);

  if (isBackendReady) {
    return children;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 z-[9999]">
      <div className="flex flex-col items-center gap-8 px-4 text-center">
        {/* Animated Logo/Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            {/* Outer rotating ring */}
            <motion.div
              className="w-24 h-24 rounded-full border-4 border-emerald-400/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner rotating ring */}
            <motion.div
              className="absolute inset-2 rounded-full border-4 border-transparent border-t-emerald-400 border-r-emerald-400"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            {/* Center pulse */}
            <motion.div
              className="absolute inset-6 rounded-full bg-emerald-400/20"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-white"
        >
          WishperWall
        </motion.h1>

        {/* Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <p className="text-lg text-emerald-400 font-medium">
            Waking up the server...
          </p>
          <p className="text-gray-400 max-w-md">
            Our backend is hosted on Render's free tier and may take up to a minute to start. 
            Thanks for your patience!
          </p>
        </motion.div>

        {/* Retry Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 text-sm text-gray-500"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Attempt {retryCount + 1} - Connecting...</span>
        </motion.div>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BackendLoader;
