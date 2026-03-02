"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ImageCard from "./ImageCard";
import ImageModal from "./ImageModal";

interface ImageType {
  id: string;
  image_url: string;
  filename: string;
  file_size: number;
  uploaded_at: string;
}

export default function MasonryGrid({
  images,
  onDelete,
}: {
  images: ImageType[];
  onDelete: (id: string) => void;
}) {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className="w-full"
          >
            <ImageCard 
              image={image} 
              onDelete={onDelete}
              onClick={() => setSelectedImage(image)}
            />
          </motion.div>
        ))}
      </div>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}