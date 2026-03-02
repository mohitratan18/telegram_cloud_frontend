"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import MasonryGrid from "@/components/MasonryGrid";
import SortDropdown from "@/components/SortDropdown";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  const [images, setImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState("uploaded_at-desc");
  const { isAuthenticated } = useAuth();

  const fetchImages = async () => {
    if (!hasMore && page > 1) return;
    
    setLoading(true);

    const [sortBy, order] = sort.split("-");

    try {
      const res = await api.get(
        `/images?page=${page}&limit=20&sortBy=${sortBy}&order=${order}`
      );

      const newImages = res.data.data || [];
      
      setImages((prev) =>
        page === 1 ? newImages : [...prev, ...newImages]
      );

      if (newImages.length < 20) {
        setHasMore(false);
      }
    } catch (error: any) {
      if (error?.response?.data?.error?.code === "PGRST103") {
        setHasMore(false);
      } else {
        console.error("Error fetching images:", error);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      setHasMore(true);
      fetchImages();
    }
  }, [page, sort, isAuthenticated]);

  const handleDelete = async (id: string) => {
    await api.delete(`/image/${id}`);
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
                Gallery
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                {images.length} {images.length === 1 ? 'image' : 'images'}
              </p>
            </div>
            <SortDropdown setSort={(value) => {
              setPage(1);
              setImages([]);
              setSort(value);
            }} />
          </div>

          {images.length === 0 && !loading ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                No images yet
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Upload your first image to get started
              </p>
            </div>
          ) : (
            <MasonryGrid images={images} onDelete={handleDelete} />
          )}

          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-neutral-400" size={28} />
            </div>
          )}

          {!hasMore && images.length > 0 && (
            <div className="text-center py-8 text-neutral-400 text-sm">
              That's all
            </div>
          )}

          <div ref={observerRef} className="h-4"></div>
        </div>
      </div>
    </ProtectedRoute>
  );
}