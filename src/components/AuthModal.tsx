"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "signin" | "signup";
  onSuccess: () => void;
};

export default function AuthModal({ isOpen, onClose, initialMode, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const endpoint = mode === "signin" ? "/api/auth/signin" : "/api/auth/signup";
      const payload = mode === "signin" 
        ? { username, password } 
        : { username, email, phone, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      onSuccess();
      router.refresh(); // Refresh to update server components with new session
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-thin tracking-tight text-gray-900 mb-2">
          {mode === "signin" ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          {mode === "signin" 
            ? "Enter your credentials to access your account." 
            : "Join the community to save colleges and post articles."}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. johndoe"
              autoComplete="new-username"
            />
          </div>

          {mode === "signup" && (
            <>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gray-900 text-white font-bold rounded-xl py-3 mt-4 hover:bg-black transition-colors disabled:opacity-50"
          >
            {isLoading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
              }}
              className="font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {mode === "signin" ? "Sign up now" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
