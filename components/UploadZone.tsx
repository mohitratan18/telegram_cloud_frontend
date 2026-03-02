"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Upload, Loader2 } from "lucide-react";

export default function UploadZone({ onUpload }: { onUpload: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    await api.post("/upload", formData);
    setLoading(false);
    onUpload();
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium transition-colors">
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Uploading...</span>
        </>
      ) : (
        <>
          <Upload size={16} />
          <span>Upload</span>
        </>
      )}
      <input
        type="file"
        hidden
        accept="image/*"
        disabled={loading}
        onChange={(e) =>
          e.target.files && handleUpload(e.target.files[0])
        }
      />
    </label>
  );
}