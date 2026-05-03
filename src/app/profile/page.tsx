"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push("/"); // Redirect if not logged in
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#fcfcfc] pt-32 text-center">Loading profile...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-20">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-12 text-center mb-12">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" className="w-32 h-32 rounded-full object-cover mx-auto mb-6 shadow-md" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-4xl font-black mx-auto mb-6 shadow-sm border-4 border-white">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">@{user.username}</h1>
          <p className="text-gray-500 font-medium mb-6">{user.email}</p>
          
          <p className="text-lg text-gray-700 max-w-lg mx-auto leading-relaxed">
            {user.bio || "This user hasn't added a bio yet."}
          </p>

          <div className="flex justify-center gap-6 mt-10 border-t border-gray-100 pt-10">
            <div className="text-center">
              <p className="text-3xl font-black text-gray-900">0</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Articles</p>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-3xl font-black text-gray-900">0</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Questions</p>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-3xl font-black text-gray-900">0</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Upvotes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
