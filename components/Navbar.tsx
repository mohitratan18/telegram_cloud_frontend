"use client";

import { useAuth } from "@/lib/auth";
import { config } from "@/lib/config";
import { LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import UploadZone from "./UploadZone";

export default function Navbar() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-neutral-900 font-semibold text-sm">
              {config.appName.charAt(0)}
            </span>
          </div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {config.appName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <UploadZone onUpload={() => window.location.reload()} />
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}