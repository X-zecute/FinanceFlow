// components/AddExpenseModal.tsx
"use client";

import React, { useState } from "react";
import { X, Tag, Calendar, Building, Loader2 } from "lucide-react";
import { db } from "@/config/firebase"; // Import Firestore instance
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  // Nigerian-focused default categories
  const nigerianCategories = [
    "Groceries & Food",
    "Fuel & Transport",
    "Airtime & Data",
    "Electricity & Utilities",
    "Housing & Rent",
    "Owambe & Parties",
    "Healthcare",
    "Education",
    "Entertainment"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Extract form data elements using FormData API
    const formData = new FormData(e.currentTarget);
    const amount = formData.get("amount");
    const merchant = formData.get("merchant");
    const category = formData.get("category");
    const date = formData.get("date");

    try {
      // Add a new document with a generated ID to the "expenses" collection in Firestore
      await addDoc(collection(db, "expenses"), {
        amount: parseFloat(amount as string),
        merchant,
        category,
        date,
        type: "expense",
        createdAt: new Date().toISOString(),
      });

      setIsLoading(false);
      onClose();
      router.refresh(); // Refresh dashboard data
    } catch (error) {
      console.error("Error adding expense to Firebase: ", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add New Expense</h3>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-6">
          
          {/* Amount Field */}
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

          {/* Merchant / Description */}
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
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select 
                  name="category"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none appearance-none cursor-pointer"
                >
                  {nigerianCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
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
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Expense"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}