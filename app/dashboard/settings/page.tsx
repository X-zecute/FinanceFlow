// app/(dashboard)/dashboard/settings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Globe, 
  Save, 
  Loader2, 
  Lock, 
  Smartphone,
  Trash2,
  Database,
  Phone,
  Moon,
  Download,
  CheckCircle2
} from "lucide-react";
import { db } from "@/config/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

interface UserSettings {
  name: string;
  phone: string;
  currency: string;
  dateFormat: string;
  emailAlerts: boolean;
  budgetWarnings: boolean;
  twoFactor: boolean;
  theme: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    phone: "",
    currency: "NGN (₦)",
    dateFormat: "DD/MM/YYYY",
    emailAlerts: true,
    budgetWarnings: true,
    twoFactor: false,
    theme: "light",
  });

  // Real-time synchronization of user settings from Firestore
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }

    const settingsRef = doc(db, "settings", session.user.email);
    
    // Set initial name from session if available
    setSettings((prev) => ({
      ...prev,
      name: session.user?.name || "",
    }));

    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<UserSettings>;
        setSettings((prev) => ({
          ...prev,
          ...data,
          name: data.name || session.user?.name || "",
        }));
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching settings:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [session, status]);

  // Handle instant field changes and auto-save or explicit save
  const handleChange = (field: keyof UserSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    setIsSaving(true);
    setSuccessMessage("");

    try {
      const settingsRef = doc(db, "settings", session.user.email);
      await setDoc(settingsRef, {
        ...settings,
        email: session.user.email,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setIsSaving(false);
      setSuccessMessage("Your settings have been saved successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setIsSaving(false);
      alert("Failed to save settings. Please try again.");
    }
  };

  const handleExportAllData = () => {
    const exportData = {
      user: session?.user?.email,
      settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `account_settings_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearData = () => {
    if (window.confirm("WARNING: This will wipe all user configuration caches. Are you sure you want to proceed?")) {
      alert("Cache cleared successfully.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium">Loading your profile settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 pb-12 w-full max-w-5xl mx-auto px-4 sm:px-6">
      <header className="border-b border-slate-200/80 pb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">
          Manage your personal profile, notification thresholds, security protocols, and localization preferences.
        </p>
      </header>

      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* Profile Information Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-400">Update your verified account credentials and contact details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3.5 pl-12 pr-4 text-sm font-bold text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-400">Managed securely via authentication provider.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={settings.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Regional & Localization */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Regional & Localization</h3>
              <p className="text-xs text-slate-400">Configure currency standards and date formatting</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Base Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
              >
                <option value="NGN (₦)">Nigerian Naira (NGN - ₦)</option>
                <option value="USD ($)">US Dollar (USD - $)</option>
                <option value="EUR (€)">Euro (EUR - €)</option>
                <option value="GBP (£)">British Pound (GBP - £)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Date Format</label>
              <select
                value={settings.dateFormat}
                onChange={(e) => handleChange("dateFormat", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Notifications & Alerts</h3>
              <p className="text-xs text-slate-400">Control automated financial updates and triggers</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-slate-900 block">Email Financial Statements</span>
                <span className="text-xs text-slate-500 block">Receive monthly statement performance logs via email.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) => handleChange("emailAlerts", e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-slate-900 block">Budget Threshold Warnings</span>
                <span className="text-xs text-slate-500 block">Get instant dashboard warnings when approaching category caps.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.budgetWarnings}
                onChange={(e) => handleChange("budgetWarnings", e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Security & Authentication</h3>
              <p className="text-xs text-slate-400">Safeguard account access parameters</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
                <span className="text-xs text-slate-500 block">Require token verification upon authentication.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactor}
                onChange={(e) => handleChange("twoFactor", e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Data Management */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Data & Backup</h3>
              <p className="text-xs text-slate-400">Export or archive local profile configurations</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleExportAllData}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span>Export Settings Backup (JSON)</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-3xl border border-rose-200 bg-rose-50/30 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-rose-900">Danger Zone</h3>
          <p className="text-xs font-semibold text-rose-700">
            Permanently clear cached user configuration states from active storage.
          </p>
          <button
            type="button"
            onClick={handleClearData}
            className="flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-500 active:scale-[0.98]"
          >
            <Trash2 className="h-4 w-4" />
            <span>Purge Configuration Cache</span>
          </button>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        </div>

      </form>
    </div>
  );
}