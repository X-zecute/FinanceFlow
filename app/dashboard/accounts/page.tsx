// app/(dashboard)/dashboard/accounts/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  Plus, Landmark, CreditCard, PiggyBank, Wallet, TrendingUp, RefreshCcw, 
  Loader2, Building, Trash2, X
} from "lucide-react";
import { db } from "@/config/firebase";
import { collection, onSnapshot, query, orderBy, where, deleteDoc, doc, addDoc } from "firebase/firestore";

interface Account {
  id: string; name: string; bank: string; type: string; number: string; balance: number; iconBg: string;
}

const getIconForType = (type: string) => {
  switch (type) {
    case "Checking": return Landmark;
    case "Savings": return PiggyBank;
    case "Credit": return CreditCard;
    case "Investment": return Wallet;
    default: return Building;
  }
};

export default function AccountsPage() {
  const { data: session, status } = useSession();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // --- Modal State ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Modal UX: Scroll Lock & Escape Key Handler ---
  useEffect(() => {
    if (!isAddModalOpen) return;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsAddModalOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddModalOpen]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.email) { setAccounts([]); setIsLoading(false); return; }

    const q = query(collection(db, "accounts"), where("userEmail", "==", session.user.email), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Account)));
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [session, status]);

  const handleAddAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const type = formData.get("type") as string;
    let iconBg = "bg-blue-100 text-blue-600";
    if (type === "Savings") iconBg = "bg-emerald-100 text-emerald-600";
    if (type === "Credit") iconBg = "bg-rose-100 text-rose-600";

    try {
      await addDoc(collection(db, "accounts"), {
        name: formData.get("name"),
        bank: formData.get("bank"),
        type: type,
        number: formData.get("number") ? `•••• ${formData.get("number")}` : "•••• ****",
        balance: parseFloat(formData.get("balance") as string) || 0,
        iconBg,
        userEmail: session?.user?.email,
        createdAt: new Date().toISOString(),
      });
      setIsSubmitting(false);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteDoc(doc(db, "accounts", id));
    }
  };

  const { totalAssets, totalLiabilities, netWorth } = useMemo(() => {
    const assets = accounts.filter((a) => a.balance > 0).reduce((acc, curr) => acc + curr.balance, 0);
    const liabilities = accounts.filter((a) => a.balance < 0).reduce((acc, curr) => acc + Math.abs(curr.balance), 0);
    return { totalAssets: assets, totalLiabilities: liabilities, netWorth: assets - liabilities };
  }, [accounts]);

  return (
    <div className="flex flex-col space-y-8 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 relative">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Linked Accounts</h1>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg cursor-pointer">
            <Plus className="h-4 w-4" /> Add Account
          </button>
        </div>
      </header>

      {/* ========================================== */}
      {/* ADD ACCOUNT MODAL OVERLAY */}
      {/* ========================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Connect New Account</h2>
                <p className="text-xs text-slate-500 mt-0.5">Add your bank or wallet to sync balances.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-500">Account Nickname</label>
                <input name="name" required placeholder="e.g. GTBank Savings" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm focus:border-cyan-500 focus:outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-500">Institution Name</label>
                <input name="bank" required placeholder="e.g. Guaranty Trust Bank" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm focus:border-cyan-500 focus:outline-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-slate-500">Account Type</label>
                  <select name="type" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm focus:border-cyan-500 focus:outline-none">
                    <option value="Checking">Checking / Current</option>
                    <option value="Savings">Savings</option>
                    <option value="Credit">Credit Card</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-slate-500">Last 4 Digits</label>
                  <input name="number" maxLength={4} placeholder="e.g. 8821" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm focus:border-cyan-500 focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-500">Opening Balance (₦)</label>
                <input name="balance" type="number" step="0.01" required placeholder="0.00" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 px-4 text-xl font-bold focus:border-cyan-500 focus:outline-none" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-cyan-500 disabled:opacity-70">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Link Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}