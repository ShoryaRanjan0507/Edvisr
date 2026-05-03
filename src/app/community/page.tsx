"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

type Question = {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  createdAt: string;
  author: {
    username: string;
    avatarUrl: string | null;
  };
};

export default function CommunityPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // New Question Form
  const [isPosting, setIsPosting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchUser();
    fetchQuestions();
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

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/questions");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
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
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        setTitle("");
        setContent("");
        fetchQuestions(); // Refresh feed
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
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Forum</p>
          <h1 className="text-4xl md:text-5xl font-thin tracking-tighter text-gray-900 mb-4">Community & Q&A</h1>
          <p className="text-gray-500 max-w-2xl">Ask questions, share advice, and connect with other students navigating the college admissions process.</p>
        </div>

        {/* Post a Question Box */}
        {user ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-12">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Ask the Community
            </h2>
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="What's your question? Be specific."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea 
                placeholder="Provide more details or context here..."
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={isPosting}
                  className="bg-gray-900 text-white text-sm font-bold px-6 py-2 rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isPosting ? "Posting..." : "Post Question"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 mb-12 flex items-center justify-between">
            <div>
              <h3 className="text-blue-900 font-bold mb-1">Have a question?</h3>
              <p className="text-blue-700/80 text-sm">You must be signed in to post to the community.</p>
            </div>
            {/* The sign in will be handled by Navbar, so we just prompt them */}
            <p className="text-xs font-black uppercase tracking-widest text-blue-500">Sign in above &uarr;</p>
          </div>
        )}

        {/* Feed */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4">Recent Discussions</h3>
          
          {isLoading ? (
            <div className="py-20 text-center text-gray-400 text-sm">Loading feed...</div>
          ) : questions.length > 0 ? (
            questions.map(q => (
              <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex gap-4">
                  {/* Upvote Column */}
                  <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-gray-900 transition-colors">
                    <button className="hover:text-blue-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
                    <span className="font-bold text-sm">{q.upvotes}</span>
                    <button className="hover:text-red-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{q.title}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{q.content}</p>
                    
                    <div className="flex items-center gap-3">
                      {q.author.avatarUrl ? (
                        <img src={q.author.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                          {q.author.username.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Posted by <span className="font-bold text-gray-900">@{q.author.username}</span> • {new Date(q.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-gray-400 text-sm">No discussions yet. Be the first to ask!</div>
          )}
        </div>
      </div>
    </div>
  );
}
