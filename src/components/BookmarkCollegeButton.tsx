"use client";

import { useState, useEffect } from "react";

// Simple global cache to prevent redundant fetches on pages with many cards
let bookmarksCache: Set<string> | null = null;
let fetchPromise: Promise<Set<string>> | null = null;

function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(bookmarksCache || new Set());
  const [loading, setLoading] = useState(!bookmarksCache);

  useEffect(() => {
    if (bookmarksCache) {
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = fetch("/api/bookmarks")
        .then((res) => (res.ok ? res.json() : { bookmarks: [] }))
        .then((data) => {
          const ids = new Set<string>();
          data.bookmarks?.forEach((b: any) => {
            if (b.collegeId) ids.add(b.collegeId);
          });
          bookmarksCache = ids;
          return ids;
        })
        .catch(() => new Set<string>());
    }

    fetchPromise.then((ids) => {
      setBookmarkedIds(ids);
      setLoading(false);
    });
  }, []);

  const toggleBookmarkId = (id: string, isBookmarked: boolean) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (isBookmarked) next.add(id);
      else next.delete(id);
      bookmarksCache = next; // Update cache
      return next;
    });
  };

  return { bookmarkedIds, toggleBookmarkId, loading };
}

export default function BookmarkCollegeButton({ collegeId }: { collegeId: string }) {
  const { bookmarkedIds, toggleBookmarkId, loading: globalLoading } = useBookmarks();
  const [isUpdating, setIsUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isBookmarked = bookmarkedIds.has(collegeId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if inside a Link
    e.stopPropagation();

    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collegeId }),
      });

      if (res.ok) {
        const data = await res.json();
        toggleBookmarkId(collegeId, data.bookmarked);
      } else if (res.status === 401) {
        alert("Please sign in to bookmark colleges.");
      }
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!mounted || globalLoading) {
    return (
      <button suppressHydrationWarning className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-300">
        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
      </button>
    );
  }

  return (
    <button
      suppressHydrationWarning
      onClick={handleToggle}
      disabled={isUpdating}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border ${
        isBookmarked 
          ? "bg-red-50 border-red-100 text-red-500 hover:bg-red-100" 
          : "bg-white/90 backdrop-blur-sm border-gray-100 text-gray-400 hover:bg-white hover:text-red-500 hover:border-red-100 hover:scale-105"
      }`}
      aria-label="Bookmark college"
    >
      <svg 
        className={`w-5 h-5 transition-transform ${isUpdating ? 'scale-90 opacity-70' : 'scale-100'}`} 
        fill={isBookmarked ? "currentColor" : "none"} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isBookmarked ? 1 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
