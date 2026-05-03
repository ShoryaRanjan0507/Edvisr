"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import Logo from "./Logo";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{ isOpen: boolean, mode: "signin" | "signup" }>({
    isOpen: false,
    mode: "signin"
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch current user on mount
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    let isMounted = true;
    const handleScroll = () => {
      if (isMounted) setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      isMounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // On home page, before scroll: transparent with white text
  // After scroll or on other pages: white background with dark text
  const navClass = isHome && !isScrolled
    ? "bg-transparent border-transparent"
    : "bg-white/80 backdrop-blur-xl border-gray-100 shadow-sm";

  const textClass = isHome && !isScrolled
    ? "text-white"
    : "text-gray-900";

  const linkClass = isHome && !isScrolled
    ? "text-white/60 hover:text-white"
    : "text-gray-400 hover:text-gray-900";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${navClass}`}>
      <div className="max-w-7xl mx-auto px-8 md:px-20">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo Section */}
          <Link href="/" className={`flex items-center gap-4 font-black text-xl tracking-tighter uppercase transition-colors flex-shrink-0 ${textClass}`}>
            <Logo className="w-8 h-8" />
            Edvisr.
          </Link>
          
          {/* Main Navigation */}
          <nav className="hidden lg:flex gap-10">
            <Link href="/" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${linkClass}`}>
              Archive
            </Link>
            <Link href="/predictor" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${linkClass}`}>
              Predictor
            </Link>
            <Link href="/compare" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${linkClass}`}>
              Compare
            </Link>
            <Link href="/community" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${linkClass}`}>
              Community
            </Link>
            <Link href="/articles" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${linkClass}`}>
              Articles
            </Link>
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-6 flex-shrink-0">
            {!user ? (
              <>
                <button 
                  onClick={() => setAuthModalConfig({ isOpen: true, mode: "signin" })} 
                  className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${linkClass}`}
                  suppressHydrationWarning
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setAuthModalConfig({ isOpen: true, mode: "signup" })} 
                  className={`text-[10px] font-black uppercase tracking-[0.3em] px-6 py-3 border rounded-full transition-all ${
                    isHome && !isScrolled 
                      ? "border-white/40 text-white hover:bg-white hover:text-black" 
                      : "border-gray-200 text-gray-900 hover:bg-gray-900 hover:text-white"
                  }`}
                  suppressHydrationWarning
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center focus:outline-none transition-transform hover:scale-105 active:scale-95"
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className={`w-10 h-10 rounded-full object-cover border ${isHome && !isScrolled ? "border-white/20" : "border-gray-200"}`} />
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border ${
                      isHome && !isScrolled 
                        ? "bg-white/10 border-white/20 text-white hover:bg-white/20" 
                        : "bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100"
                    }`}>
                      {user.username.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl py-2 flex flex-col z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
                    <div className="px-5 py-4 border-b border-gray-50 mb-2 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-900">@{user.username}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-black hover:bg-gray-50 transition-colors flex items-center gap-3"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Profile
                    </Link>
                    <Link 
                      href="/bookmarks" 
                      className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-black hover:bg-gray-50 transition-colors flex items-center gap-3"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                      Saved Articles
                    </Link>
                    <Link 
                      href="/settings" 
                      className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-black hover:bg-gray-50 transition-colors flex items-center gap-3"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                      Settings
                    </Link>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button 
                      onClick={handleSignOut} 
                      className="px-5 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors w-full flex items-center gap-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AuthModal 
        isOpen={authModalConfig.isOpen} 
        initialMode={authModalConfig.mode}
        onClose={() => setAuthModalConfig({ ...authModalConfig, isOpen: false })}
        onSuccess={() => {
          setAuthModalConfig({ ...authModalConfig, isOpen: false });
          fetchUser();
        }}
      />
    </header>
  );
}
