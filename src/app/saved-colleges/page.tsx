"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CollegeCard from "@/components/CollegeCard";
import { College } from "@prisma/client";

type Bookmark = {
  id: string;
  college: College | null;
};

export default function SavedCollegesPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("/api/bookmarks");
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks);
      } else if (res.status === 401) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const bookmarkedColleges = bookmarks.filter(b => b.college);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="mb-12">
          <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Favorites</p>
          <h1 className="text-4xl md:text-5xl font-thin tracking-tighter text-gray-900 mb-4">Saved Colleges</h1>
          <p className="text-gray-500 max-w-2xl">Access all the institutions you've bookmarked to compare and review later.</p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-400">Loading your saved colleges...</div>
        ) : bookmarkedColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookmarkedColleges.map(b => (
              <CollegeCard key={b.id} college={b.college!} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-3xl border border-gray-200 border-dashed p-12 text-center max-w-2xl mx-auto">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No saved colleges yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">When you find a college you want to keep track of, bookmark it to find it here later.</p>
            <Link href="/" className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition-colors inline-block">
              Explore Colleges
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
