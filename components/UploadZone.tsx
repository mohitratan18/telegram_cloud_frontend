"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Upload, Loader2, X, CheckCircle, AlertCircle, Image as ImageIcon } from "lucide-react";

interface UploadResult {
  success: boolean;
  uploaded: number;
  failed: number;
  total: number;
  results: Array<{
    filename: string;
    file_id?: string;
    message_id?: number;
    size?: number;
    success: boolean;
  }>;
  errors?: Array<{
    filename: string;
    error: string;
  }>;
}

export default function UploadZone({ onUpload }: { onUpload: () => void }) {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Check for duplicates based on name, size, and last modified date
      const newFiles: File[] = [];
      const duplicates: string[] = [];
      
      files.forEach(file => {
        const isDuplicate = selectedFiles.some(
          existingFile =>
            existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified
        );
        
        if (isDuplicate) {
          duplicates.push(file.name);
        } else {
          newFiles.push(file);
        }
      });
      
      // Show alert if duplicates found
      if (duplicates.length > 0) {
        alert(
          `${duplicates.length} duplicate file${duplicates.length !== 1 ? "s" : ""} skipped:\n${duplicates.join("\n")}`
        );
      }
      
      // Check total file count
      const totalFiles = selectedFiles.length + newFiles.length;
      
      if (totalFiles > 20) {
        alert(`Maximum 20 files allowed. You can add ${20 - selectedFiles.length} more file(s).`);
        return;
      }
      
      // Only proceed if there are new files to add
      if (newFiles.length > 0) {
        // Create preview URLs for new files
        const newUrls = newFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newUrls]);
        setSelectedFiles(prev => [...prev, ...newFiles]);
        
        if (!showModal) {
          setShowModal(true);
          setUploadResult(null);
        }
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    setLoading(true);
    setUploadProgress(0);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setUploadProgress(percentCompleted);
        },
      });

      setUploadResult(response.data);
      
      if (response.data.success && response.data.failed === 0) {
        setTimeout(() => {
          closeModal();
          onUpload();
        }, 2000);
      }
    } catch (error: any) {
      alert("Upload failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (index: number) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const closeModal = () => {
    if (!loading) {
      // Clean up preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      setShowModal(false);
      setSelectedFiles([]);
      setPreviewUrls([]);
      setUploadResult(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <>
      <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium transition-colors">
        <Upload size={16} />
        <span>Upload</span>
        <input
          type="file"
          hidden
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={loading}
        />
      </label>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] my-auto overflow-hidden border border-neutral-200 dark:border-neutral-800 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Upload Images
              </h2>
              {!loading && (
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-neutral-500" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              {!uploadResult ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""} selected (max 20 files, 100MB each)
                    </p>
                    
                    {/* Add More Button */}
                    {selectedFiles.length < 20 && !loading && (
                      <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-colors">
                        <Upload size={14} />
                        <span>Add More</span>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          multiple
                          onChange={handleFileSelect}
                        />
                      </label>
                    )}
                  </div>

                  {/* File List with Previews */}
                  <div className="space-y-3">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"
                      >
                        {/* Image Preview */}
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                          {previewUrls[index] ? (
                            <img
                              src={previewUrls[index]}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={24} className="text-neutral-400" />
                            </div>
                          )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        {!loading && (
                          <button
                            onClick={() => removeFile(index)}
                            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex-shrink-0"
                          >
                            <X size={16} className="text-neutral-500" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  {loading && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          Uploading...
                        </span>
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neutral-900 dark:bg-white transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Upload Results */
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                    {uploadResult.failed === 0 ? (
                      <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                    ) : (
                      <AlertCircle className="text-yellow-500 flex-shrink-0" size={24} />
                    )}
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {uploadResult.uploaded} of {uploadResult.total} uploaded successfully
                      </p>
                      {uploadResult.failed > 0 && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {uploadResult.failed} failed
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Errors */}
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                        Errors:
                      </h3>
                      {uploadResult.errors.map((error, index) => (
                        <div
                          key={index}
                          className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl"
                        >
                          <p className="text-sm font-medium text-red-700 dark:text-red-400">
                            {error.filename}
                          </p>
                          <p className="text-xs text-red-600 dark:text-red-500">
                            {error.error}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-800 flex-shrink-0">
              {!uploadResult ? (
                <>
                  <button
                    onClick={closeModal}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={loading || selectedFiles.length === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        <span>Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}