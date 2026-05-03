"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  const [successMsg, setSuccessMsg] = useState("");

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
        setBio(data.user.bio || "");
        setPhone(data.user.phone || "");
        setAvatarUrl(data.user.avatarUrl || "");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, phone, avatarUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSuccessMsg("Settings saved successfully.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#fcfcfc] pt-32 text-center">Loading settings...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-20">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-thin tracking-tighter text-gray-900 mb-4">Account Settings</h1>
          <p className="text-gray-500">Manage your profile details and personal preferences.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4">
            {/* Sidebar */}
            <div className="bg-gray-50 p-8 border-r border-gray-100">
              <nav className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-sm font-bold text-gray-900">
                  Profile Details
                </button>
                <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Security
                </button>
                <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Notifications
                </button>
              </nav>
            </div>

            {/* Main Form */}
            <div className="md:col-span-3 p-8">
              {successMsg && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 text-sm font-bold rounded-xl flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Username</label>
                  <input 
                    type="text" 
                    value={user.username}
                    disabled
                    className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">Username cannot be changed</p>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={user.email}
                    disabled
                    className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Avatar URL</label>
                  <input 
                    type="url" 
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Bio</label>
                  <textarea 
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-blue-600 text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
