"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

type Article = {
  id: string;
  title: string;
  content: string;
  readTime: number;
  createdAt: string;
  author: {
    username: string;
    avatarUrl: string | null;
  };
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // New Article Form
  const [isPosting, setIsPosting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isWriteMode, setIsWriteMode] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchArticles();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/articles");
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsPosting(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, readTime: Math.ceil(content.split(" ").length / 200) || 1 }),
      });
      if (res.ok) {
        setTitle("");
        setContent("");
        setIsWriteMode(false);
        fetchArticles(); // Refresh feed
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-20">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Content Hub</p>
            <h1 className="text-4xl md:text-5xl font-thin tracking-tighter text-gray-900 mb-4">Articles & Advisories</h1>
            <p className="text-gray-500 max-w-2xl">Read in-depth guides, career advice, and expert insights on top colleges from the community.</p>
          </div>
          {user && !isWriteMode && (
            <button 
              onClick={() => setIsWriteMode(true)}
              className="bg-gray-900 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Write Article
            </button>
          )}
        </div>

        {/* Write Article Box */}
        {isWriteMode && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-16 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Draft a new article</h2>
              <button onClick={() => setIsWriteMode(false)} className="text-gray-400 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handlePostSubmit} className="space-y-6">
              <input 
                type="text" 
                placeholder="Catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full text-3xl font-thin text-gray-900 border-none focus:ring-0 placeholder:text-gray-300 px-0 bg-transparent"
              />
              <textarea 
                placeholder="Start writing your story..."
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full text-lg leading-relaxed text-gray-700 border-none focus:ring-0 placeholder:text-gray-300 px-0 resize-none bg-transparent"
              ></textarea>
              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  Est. Read: {Math.ceil(content.split(" ").filter(w => w).length / 200) || 1} min
                </p>
                <button 
                  type="submit" 
                  disabled={isPosting}
                  className="bg-blue-600 text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isPosting ? "Publishing..." : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            <div className="col-span-1 md:col-span-2 py-20 text-center text-gray-400 text-sm">Loading articles...</div>
          ) : articles.length > 0 ? (
            articles.map((article, i) => (
              <div key={article.id} className="bg-white rounded-[32px] border border-gray-100 p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all group flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  {article.author.avatarUrl ? (
                    <img src={article.author.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                      {article.author.username.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-900">@{article.author.username}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(article.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-500 leading-relaxed line-clamp-3 mb-8 flex-1">
                  {article.content}
                </p>
                
                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {article.readTime} min read
                  </span>
                  <button className="text-blue-600 text-sm font-bold hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read more &rarr;
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 py-20 text-center text-gray-400 text-sm">No articles published yet. Be the first!</div>
          )}
        </div>
      </div>
    </div>
  );
}
