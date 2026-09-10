// app/(dashboard)/dashboard/transactions/new/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Tag, Calendar, Building, Loader2, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function NewTransactionPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");

  const defaultCategories = [
    "Groceries & Food", "Fuel & Transport", "Airtime & Data", "Electricity & Utilities", 
    "Housing & Rent", "Owambe & Parties", "Entertainment", "Healthcare", 
    "Education", "Salary / Income", "Business / Freelance", "Investments"
  ];

  const defaultAccounts = [
    "GTBank Savings (...8821)",
    "Zenith Current (...4390)",
    "Kuda Bank (...1120)",
    "OPay Wallet",
    "Moniepoint",
    "Cash Wallet"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const amount = formData.get("amount");
    const merchant = formData.get("merchant");
    const category = formData.get("category");
    const date = formData.get("date");
    const account = formData.get("account");

    try {
      await addDoc(collection(db, "expenses"), {
        amount: parseFloat(amount as string),
        merchant,
        category,
        date,
        account,
        type: transactionType,
        userEmail: session?.user?.email || "unknown",
        createdAt: new Date().toISOString(),
      });

      setIsLoading(false);
      router.push("/dashboard/transactions");
      router.refresh();
    } catch (error) {
      console.error("Error writing transaction to Firebase: ", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12 w-full">
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to transactions
      </button>

      <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">New Transaction</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Record and categorize your cash flow in Nigerian Naira (₦).</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setTransactionType("expense")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                transactionType === "expense" ? "bg-white dark:bg-slate-900 text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <ArrowDownRight className="h-4 w-4" /> Expense
            </button>
            <button
              type="button"
              onClick={() => setTransactionType("income")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                transactionType === "income" ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <ArrowUpRight className="h-4 w-4" /> Income
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount (₦)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400">₦</span>
              <input
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                autoFocus
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-xl font-bold text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Merchant / Title</label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                name="merchant"
                type="text"
                placeholder="e.g. Shoprite, Eko Electricity, Chicken Republic"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="category"
                  list="category-options"
                  placeholder="Select or type..."
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none"
                />
                <datalist id="category-options">
                  {defaultCategories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Account</label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="account"
                  list="account-options"
                  placeholder="Select or type..."
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none"
                />
                <datalist id="account-options">
                  {defaultAccounts.map((acc) => (
                    <option key={acc} value={acc} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                name="date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

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
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Transaction"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}