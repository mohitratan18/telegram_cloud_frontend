"use client";

import { Trash2, Download, Calendar, HardDrive } from "lucide-react";
import { useState } from "react";
import { formatFileSize, formatDate } from "@/lib/utils";

export default function ImageCard({
  image,
  onDelete,
  onClick,
}: {
  image: any;
  onDelete: (id: string) => void;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = image.image_url;
    link.download = image.filename;
    link.click();
  };

  return (
    <div
      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col border border-neutral-200 dark:border-neutral-800"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div onClick={onClick} className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={image.image_url}
          alt={image.filename}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {hovered && (
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={handleDownload}
            className="p-2 bg-white dark:bg-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-300 hover:scale-110 transition-transform shadow-md"
          >
            <Download size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image.id);
            }}
            className="p-2 bg-red-500 rounded-lg text-white hover:scale-110 hover:bg-red-600 transition-all shadow-md"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <div className="p-3 space-y-1">
        <p className="truncate font-medium text-sm text-neutral-900 dark:text-neutral-100">
          {image.filename}
        </p>
        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1">
            <HardDrive size={12} />
            <span>{formatFileSize(image.file_size)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formatDate(image.uploaded_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}