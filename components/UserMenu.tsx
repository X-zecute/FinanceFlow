// components/UserMenu.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function UserMenu({ email }: { email: string | null | undefined }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
      >
       
        <span className="truncate max-w-[150px] sm:max-w-none">{email || userName}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-top-2 z-50">
          
          <Link
            href="/dashboard/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <User className="h-4 w-4 text-slate-400" /> Profile
          </Link>
          
          <Link
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Settings className="h-4 w-4 text-slate-400" /> Settings
          </Link>
          
          <div className="my-1 border-t border-slate-100"></div>
          
          <button
            onClick={() => signOut({ callbackUrl: "/get-started" })}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-rose-500" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}