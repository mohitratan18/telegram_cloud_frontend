"use client";

import { X, Download, Calendar, HardDrive } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatFileSize, formatDate } from "@/lib/utils";

interface ImageModalProps {
  image: {
    id: string;
    image_url: string;
    filename: string;
    file_size: number;
    uploaded_at: string;
  };
  onClose: () => void;
}

export default function ImageModal({ image, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.image_url;
    link.download = image.filename;
    link.click();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
        onClick={onClose}
      >
        {/* Close button */}
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90 duration-300"
        >
          <X size={24} />
        </motion.button>

        {/* Download button */}
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.25 }}
          onClick={handleDownload}
          className="absolute top-6 right-24 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110 duration-300"
        >
          <Download size={24} />
        </motion.button>

        {/* Image container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-7xl max-h-[90vh] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={image.image_url}
              alt={image.filename}
              className="max-w-full max-h-[75vh] object-contain"
            />
          </div>

          {/* Info card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <p className="font-semibold text-xl text-white mb-3">{image.filename}</p>
            <div className="flex items-center gap-6 text-sm text-neutral-300">
              <div className="flex items-center gap-2">
                <HardDrive size={16} />
                <span>{formatFileSize(image.file_size)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(image.uploaded_at)}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
