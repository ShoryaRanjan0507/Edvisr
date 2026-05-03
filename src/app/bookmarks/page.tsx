"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Bookmark = {
  id: string;
  article: {
    id: string;
    title: string;
    readTime: number;
    createdAt: string;
  } | null;
  college: any | null; // simplified
};

export default function BookmarksPage() {
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

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-20">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Library</p>
          <h1 className="text-4xl md:text-5xl font-thin tracking-tighter text-gray-900 mb-4">Saved Articles</h1>
          <p className="text-gray-500 max-w-2xl">Access all the articles, guides, and college pages you've bookmarked for later reading.</p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-400">Loading your saved content...</div>
        ) : bookmarks.filter(b => b.article).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookmarks.filter(b => b.article).map(b => (
              <div key={b.id} className="bg-white rounded-[24px] border border-gray-100 p-6 flex flex-col justify-between group hover:border-blue-200 transition-colors">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{b.article!.title}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-6">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {b.article!.readTime} min read
                  </p>
                </div>
                <Link href="/articles" className="text-sm font-bold text-blue-600 self-start hover:underline">
                  Read Article &rarr;
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-3xl border border-gray-200 border-dashed p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No saved articles yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">When you find an article you want to keep, bookmark it to find it here later.</p>
            <Link href="/articles" className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition-colors">
              Explore Articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
