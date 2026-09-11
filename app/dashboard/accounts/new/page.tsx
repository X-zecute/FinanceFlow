// app/(dashboard)/dashboard/accounts/new/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Landmark, CreditCard, PiggyBank, Wallet, Loader2 } from "lucide-react";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function NewAccountPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const type = formData.get("type") as string;
    
    // Assign themed background based on account type
    let iconBg = "bg-blue-100 text-blue-600";
    if (type === "Savings") iconBg = "bg-emerald-100 text-emerald-600";
    if (type === "Credit") iconBg = "bg-rose-100 text-rose-600";
    if (type === "Investment") iconBg = "bg-purple-100 text-purple-600";

    try {
      await addDoc(collection(db, "accounts"), {
        name: formData.get("name"),
        bank: formData.get("bank"),
        type: type,
        number: formData.get("number") ? `•••• ${formData.get("number")}` : "•••• ****",
        balance: parseFloat(formData.get("balance") as string) || 0,
        iconBg,
        userEmail: session?.user?.email || "unknown",
        createdAt: new Date().toISOString(),
      });

      router.push("/dashboard/accounts");
      router.refresh();
    } catch (error) {
      console.error("Error adding account:", error);
      alert("Failed to add account. Please check your network or security rules.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12 w-full px-4 sm:px-6">
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Accounts
      </button>

      <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-900">Connect New Account</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add your Nigerian bank, fintech wallet, or credit card to sync balance tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Account Nickname</label>
            <input
              name="name"
              required
              placeholder="e.g. GTBank Savings, Salary Wallet, Emergency Fund"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm font-semibold text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Institution / Bank Name</label>
            <input
              name="bank"
              required
              placeholder="e.g. Guaranty Trust Bank, Kuda, OPay, Zenith"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm font-semibold text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Account Type</label>
              <select
                name="type"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm font-semibold text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="Checking">Checking / Current</option>
                <option value="Savings">Savings</option>
                <option value="Credit">Credit Card</option>
                <option value="Investment">Investment / Crypto</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Last 4 Digits</label>
              <input
                name="number"
                maxLength={4}
                placeholder="e.g. 8821"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm font-semibold text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Opening Balance (₦)</label>
            <input
              name="balance"
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 px-4 text-xl font-bold text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 transition-all disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Link Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}