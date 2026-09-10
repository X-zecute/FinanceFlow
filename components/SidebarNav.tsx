// components/SidebarNav.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  BarChart3,
  Landmark,
  Settings,
  Plus,
  PiggyBank,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";
import AddExpenseModal from "./AddExpenseModal";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { label: "Budgets", href: "/dashboard/budgets", icon: PieChart },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Accounts", href: "/dashboard/accounts", icon: Landmark },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "user@example.com";
  const userImage = session?.user?.image;

  // Close mobile menu and profile dropdown automatically when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const SidebarContent = () => (
    <div className="flex h-dvh flex-col justify-between p-5">
      <div className="space-y-8">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-2">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
              <PiggyBank className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              FINANCE<span className="text-cyan-500">FLOW</span>
            </span>
          </Link>
          
          {/* Close button for mobile only */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm dark:bg-slate-800 dark:text-cyan-400"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive
                      ? "text-white dark:text-cyan-400"
                      : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Add Expense & User Profile Dropdown */}
      <div className="space-y-3 pt-4 mt-auto border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => setIsExpenseModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:opacity-95 active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          <span>Add Expense</span>
        </button>

        {/* Profile Dropdown Section */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 truncate">
              {userImage ? (
                <img src={userImage} alt={userName} className="h-8 w-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{userEmail}</p>
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Popup Menu */}
          {isProfileOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-full rounded-2xl bg-white p-2 shadow-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <Link
                href="/dashboard/profile"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <User className="h-4 w-4 text-blue-600" />
                <span>Profile</span>
              </Link>

              <Link
                href="/dashboard/settings"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                <span>Settings</span>
              </Link>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>

              <button
                onClick={() => signOut({ callbackUrl: "/get-started" })}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-rose-500" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md">
            <PiggyBank className="h-5 w-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            FINANCE<span className="text-cyan-500">FLOW</span>
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* --- ADD EXPENSE MODAL --- */}
      <AddExpenseModal 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)} 
      />
    </>
  );
}