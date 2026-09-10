"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Tag, Loader2, Palette, Shapes } from "lucide-react";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function NewBudgetPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const nigerianBudgetCategories = [
    "Groceries & Food",
    "Fuel & Transport",
    "Airtime & Data",
    "Electricity & Utilities",
    "Housing & Rent",
    "Owambe & Parties",
    "Healthcare",
    "Education"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const category = formData.get("category");
    const limit = formData.get("limit");
    const iconName = formData.get("iconName");
    const color = formData.get("color");

    try {
      await addDoc(collection(db, "budgets"), {
        category,
        limit: parseFloat(limit as string),
        spent: 0,
        iconName,
        color,
        userEmail: session?.user?.email || "unknown",
        createdAt: new Date().toISOString(),
      });

      setIsLoading(false);
      router.push("/dashboard/budgets");
      router.refresh();
    } catch (error) {
      console.error("Error creating budget in Firebase: ", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 w-full">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to budgets
      </button>

      <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Create New Budget</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Set a monthly spending limit in Naira (₦) for a specific category.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-6">

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category Name</label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                name="category"
                list="budget-categories"
                type="text"
                placeholder="e.g. Groceries & Food, Airtime & Data, Transport"
                required
                autoFocus
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
              <datalist id="budget-categories">
                {nigerianBudgetCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Monthly Limit (₦)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400">₦</span>
              <input
                name="limit"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-xl font-bold text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Display Icon</label>
              <div className="relative">
                <Shapes className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  name="iconName"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="Home">Home (Housing)</option>
                  <option value="ShoppingBag">Shopping Bag (Groceries)</option>
                  <option value="Car">Car (Transportation)</option>
                  <option value="Utensils">Utensils (Dining Out)</option>
                  <option value="Film">Film (Entertainment)</option>
                  <option value="Zap">Lightning (Utilities)</option>
                  <option value="HeartPulse">Heart (Health/Medical)</option>
                  <option value="GraduationCap">Graduation (Education)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Theme Color</label>
              <div className="relative">
                <Palette className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  name="color"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:border-cyan-500 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="bg-blue-500">Blue</option>
                  <option value="bg-emerald-500">Emerald Green</option>
                  <option value="bg-rose-500">Rose Red</option>
                  <option value="bg-amber-500">Amber Orange</option>
                  <option value="bg-purple-500">Purple</option>
                  <option value="bg-sky-500">Sky Blue</option>
                  <option value="bg-indigo-500">Indigo</option>
                </select>
              </div>
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
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}