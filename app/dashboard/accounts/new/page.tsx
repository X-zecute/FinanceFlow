"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Landmark,
  Building,
  Hash,
  Loader2,
  Palette,
  CreditCard
} from "lucide-react";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function NewAccountPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const nigerianBanks = [
    "Access Bank",
    "Zenith Bank",
    "Guaranty Trust Bank (GTBank)",
    "First Bank of Nigeria",
    "United Bank for Africa (UBA)",
    "Stanbic IBTC Bank",
    "FCMB",
    "Sterling Bank",
    "Wema Bank",
    "Union Bank",
    "Kuda Microfinance Bank",
    "Moniepoint Microfinance Bank",
    "OPay",
    "PalmPay",
    "PiggyVest",
    "Cowrywise"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const bank = formData.get("bank");
    const type = formData.get("type");
    const lastFour = formData.get("number");
    const balance = formData.get("balance");
    const theme = formData.get("theme");

    let parsedBalance = parseFloat(balance as string);
    if (type === "Credit" && parsedBalance > 0) {
      parsedBalance = -Math.abs(parsedBalance);
    }

    try {
      await addDoc(collection(db, "accounts"), {
        name,
        bank,
        type,
        number: `•••• ${lastFour}`,
        balance: parsedBalance,
        iconBg: theme,
        userEmail: session?.user?.email || "unknown",
        createdAt: new Date().toISOString(),
      });

      setIsLoading(false);
      router.push("/dashboard/accounts");
      router.refresh();
    } catch (error) {
      console.error("Error creating account in Firebase: ", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12 w-full">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to accounts
      </button>

      <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Connect New Account</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Add a bank account, credit card, or investment portfolio to your dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-6">

          {/* Account Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Account Nickname</label>
            <div className="relative">
              <Landmark className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                name="name"
                type="text"
                placeholder="e.g. Primary Checking, Emergency Fund"
                required
                autoFocus
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Institution / Bank */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Institution Name</label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="bank"
                  list="nigerian-banks"
                  type="text"
                  placeholder="e.g. GTBank, Zenith, OPay"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none"
                />
                <datalist id="nigerian-banks">
                  {nigerianBanks.map((bank) => (
                    <option key={bank} value={bank} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Account Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Account Type</label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  name="type"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="Checking">Current / Checking</option>
                  <option value="Savings">Savings Account</option>
                  <option value="Credit">Credit Card</option>
                  <option value="Investment">Investment / Fintech</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Last 4 Digits */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Last 4 Digits</label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="number"
                  type="text"
                  maxLength={4}
                  pattern="\d{4}"
                  placeholder="e.g. 8821"
                  title="Please enter exactly 4 digits"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Current Balance */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Balance</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400">₦</span>
                <input
                  name="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Theme Color Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Display Theme</label>
            <div className="relative">
              <Palette className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <select
                name="theme"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="bg-blue-100 text-blue-600">Blue Theme (Default)</option>
                <option value="bg-emerald-100 text-emerald-600">Emerald Theme (Good for Savings)</option>
                <option value="bg-slate-100 text-slate-600">Slate Theme (Good for Credit)</option>
                <option value="bg-purple-100 text-purple-600">Purple Theme (Good for Investments)</option>
                <option value="bg-rose-100 text-rose-600">Rose Theme</option>
                <option value="bg-amber-100 text-amber-600">Amber Theme</option>
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}