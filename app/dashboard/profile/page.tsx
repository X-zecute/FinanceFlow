// app/(dashboard)/dashboard/settings/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Shield, 
  CheckCircle2 
} from "lucide-react";
import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function SettingsProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    role: "Standard User",
  });

  useEffect(() => {
    if (status === "loading") return;

    const userEmail = session?.user?.email;
    if (!userEmail) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "settings", userEmail);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || session?.user?.name || "",
            phone: data.phone || "",
            bio: data.bio || "",
            role: data.role || "Standard User",
          });
        } else {
          setFormData({
            name: session?.user?.name || "",
            phone: "",
            bio: "",
            role: "Standard User",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userEmail = session?.user?.email;
    if (!userEmail) return;

    setIsSaving(true);
    setSuccessMessage("");

    try {
      const docRef = doc(db, "settings", userEmail);
      await setDoc(docRef, {
        ...formData,
        email: userEmail,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setIsSaving(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsSaving(false);
      alert("Failed to save profile changes.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const userName = formData.name || session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image;

  return (
    <div className="flex flex-col space-y-8 pb-12 w-full max-w-4xl mx-auto px-4 sm:px-6">
      <button 
        onClick={() => router.push("/dashboard/settings")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors w-fit cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Settings
      </button>

      <header className="border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 ">
          Profile Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Manage your personal identification details and public account profile.
        </p>
      </header>

      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="relative group w-20 h-20 rounded-2xl overflow-hidden bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-600/20 shrink-0">
              {userImage ? (
                <img src={userImage} alt={userName} className="w-full h-full object-cover" />
              ) : (
                userName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{userName}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{userEmail}</p>
              <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-[11px] font-bold">
                <Shield className="h-3 w-3" /> {formData.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800 dark:border-slate-700 py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100 dark:bg-slate-800/50 dark:border-slate-700 py-3.5 pl-12 pr-4 text-sm font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-400">Email is linked to your authentication provider.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800 dark:border-slate-700 py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Bio / About</label>
              <textarea
                rows={3}
                placeholder="Brief description about your financial goals..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800 dark:border-slate-700 p-4 text-sm font-bold text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save Profile</>}
          </button>
        </div>
      </form>
    </div>
  );
}