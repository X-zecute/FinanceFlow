// app/(dashboard)/dashboard/budgets/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  Home,
  ShoppingBag,
  Car,
  Utensils,
  Film,
  Zap,
  Lightbulb,
  Info,
  HeartPulse,
  GraduationCap,
  CircleHelp,
  Loader2,
  Wallet,
  Trash2,
  X,
  Tag,
  Shapes,
  Palette
} from "lucide-react";
import { db } from "@/config/firebase";
import { collection, onSnapshot, query, orderBy, where, deleteDoc, doc, addDoc } from "firebase/firestore";

interface BudgetCategory {
  id: string;
  category: string;
  limit: number;
  spent: number; 
  iconName: string;
  color: string;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  type: string;
  date: string;
}

const getIconComponent = (name: string) => {
  switch (name) {
    case "Home": return Home;
    case "ShoppingBag": return ShoppingBag;
    case "Car": return Car;
    case "Utensils": return Utensils;
    case "Film": return Film;
    case "Zap": return Zap;
    case "HeartPulse": return HeartPulse;
    case "GraduationCap": return GraduationCap;
    default: return CircleHelp;
  }
};

const getThemeColors = (color: string) => {
  const themes: Record<string, string> = {
    "bg-blue-500": "bg-blue-100 text-blue-600",
    "bg-emerald-500": "bg-emerald-100 text-emerald-600",
    "bg-rose-500": "bg-rose-100 text-rose-600",
    "bg-amber-500": "bg-amber-100 text-amber-600",
    "bg-purple-500": "bg-purple-100 text-purple-600",
    "bg-sky-500": "bg-sky-100 text-sky-600",
    "bg-indigo-500": "bg-indigo-100 text-indigo-600",
  };
  return themes[color] || "bg-slate-100 text-slate-600";
};

export default function BudgetsPage() {
  const { data: session, status } = useSession();
  
  const [rawBudgets, setRawBudgets] = useState<BudgetCategory[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  const [loadingBudgets, setLoadingBudgets] = useState(true);
  const [loadingExpenses, setLoadingExpenses] = useState(true);

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

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.email) {
      setRawBudgets([]);
      setExpenses([]);
      setLoadingBudgets(false);
      setLoadingExpenses(false);
      return;
    }

    const budgetsQuery = query(
      collection(db, "budgets"), 
      where("userEmail", "==", session.user.email),
      orderBy("createdAt", "desc")
    );
    const unsubBudgets = onSnapshot(budgetsQuery, (snapshot) => {
      const fetchedBudgets = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          category: data.category || "Unknown",
          limit: data.limit || 0,
          spent: 0,
          iconName: data.iconName || "CircleHelp",
          color: data.color || "bg-slate-500",
        };
      });
      setRawBudgets(fetchedBudgets);
      setLoadingBudgets(false);
    }, (error) => {
      console.error("Error loading budgets: ", error);
      setLoadingBudgets(false);
    });

    const expensesQuery = query(
      collection(db, "expenses"),
      where("userEmail", "==", session.user.email)
    );
    const unsubExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const fetchedExpenses = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          category: data.category || "General",
          amount: data.amount || 0,
          type: data.type || "expense",
          date: data.date || new Date().toISOString().split("T")[0],
        };
      });
      setExpenses(fetchedExpenses);
      setLoadingExpenses(false);
    }, (error) => {
      console.error("Error loading expenses for budgets: ", error);
      setLoadingExpenses(false);
    });

    return () => {
      unsubBudgets();
      unsubExpenses();
    };
  }, [session, status]);

  const handleDeleteBudget = async (id: string, category: string) => {
    if (window.confirm(`Are you sure you want to delete the budget for "${category}"?`)) {
      try {
        await deleteDoc(doc(db, "budgets", id));
      } catch (error) {
        console.error("Error deleting budget: ", error);
        alert("Failed to delete budget.");
      }
    }
  };

  const handleCreateBudget = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

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

      setIsSubmitting(false);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error creating budget in Firebase: ", error);
      setIsSubmitting(false);
      alert("Failed to create budget.");
    }
  };

  const budgets = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return rawBudgets.map((budget) => {
      const categoryExpenses = expenses.filter((ex) => {
        // Safe local date parsing avoiding UTC offset discrepancies
        const [year, month, day] = ex.date.split("-").map(Number);
        const txDate = new Date(year, month - 1, day);
        
        const matchesDate = txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
        return ex.category === budget.category && ex.type !== "income" && matchesDate;
      });
      
      const totalSpentForCategory = categoryExpenses.reduce(
        (acc, curr) => acc + Math.abs(curr.amount), 0
      );

      return {
        ...budget,
        spent: totalSpentForCategory,
      };
    });
  }, [rawBudgets, expenses]);

  const totalSpent = budgets.reduce((acc, item) => acc + item.spent, 0);
  const totalLimit = budgets.reduce((acc, item) => acc + item.limit, 0);
  const overallPercentage = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  const overBudgetCategories = budgets.filter((b) => b.spent > b.limit);
  const nearLimitCategories = budgets.filter(
    (b) => b.limit > 0 && b.spent / b.limit >= 0.85 && b.spent <= b.limit
  );

  const isLoading = loadingBudgets || loadingExpenses;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium">Syncing your secure budgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 pb-8 w-full max-w-7xl mx-auto px-4 sm:px-6 relative">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Budgets
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Track category spending limits and maintain financial control based on your inputs.
          </p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-[0.98] w-full sm:w-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Budget</span>
        </button>
      </header>

      {budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-20 px-4 text-center shadow-sm mt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <Wallet className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No budgets found</h2>
          <p className="text-slate-500 max-w-sm mb-6 text-sm">
            You haven't set up any budgets yet. Create your first budget to start tracking your category limits!
          </p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create First Budget
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-center">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Budget Summary</p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-3xl lg:text-4xl font-black text-slate-900">
                      ₦{totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm lg:text-base font-semibold text-slate-400">
                      of ₦{totalLimit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Overall Used</span>
                    <span className={`text-2xl font-black ${overallPercentage > 90 ? "text-rose-600" : "text-emerald-600"}`}>
                      {overallPercentage}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex justify-between text-xs sm:text-sm font-bold mb-2">
                  <span className="text-slate-700">Total Progress</span>
                  <span className="text-slate-500">₦{Math.max(0, totalLimit - totalSpent).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Remaining</span>
                </div>
                <div className="h-3.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      overallPercentage > 90 ? "bg-rose-500" : "bg-gradient-to-r from-cyan-500 to-blue-500"
                    }`}
                    style={{ width: `${Math.min(overallPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-black text-slate-900">Smart Insights</h3>
              </div>
              
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2">
                {overBudgetCategories.map(budget => (
                  <div key={`alert-${budget.id}`} className="flex items-start gap-3 rounded-2xl bg-rose-50 p-3.5 border border-rose-100">
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-rose-800 leading-relaxed">
                      <span>{budget.category}</span> exceeded by ₦{Math.abs(budget.limit - budget.spent).toLocaleString()}. Consider shifting funds.
                    </p>
                  </div>
                ))}

                {nearLimitCategories.map(budget => (
                  <div key={`warn-${budget.id}`} className="flex items-start gap-3 rounded-2xl bg-amber-50 p-3.5 border border-amber-100">
                    <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-amber-800 leading-relaxed">
                      <span>{budget.category}</span> is at {Math.round((budget.spent/budget.limit)*100)}% capacity. Slow down spending.
                    </p>
                  </div>
                ))}

                {overBudgetCategories.length === 0 && nearLimitCategories.length === 0 && (
                  <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-3.5 border border-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                      Great job! All your budgets are currently on track this month.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {budgets.map((b) => {
              const Icon = getIconComponent(b.iconName);
              const iconTheme = getThemeColors(b.color);
              
              const percentage = b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0;
              const isOverBudget = b.spent > b.limit;
              const isNearLimit = percentage >= 85 && !isOverBudget;

              return (
                <div
                  key={b.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconTheme}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-base">{b.category}</h3>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">Monthly Limit</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteBudget(b.id, b.category)}
                        className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Budget"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-6 flex items-baseline justify-between">
                      <div className="truncate pr-2">
                        <span className="text-2xl font-black text-slate-900">
                          ₦{b.spent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-sm font-semibold text-slate-400">
                          {" "} / ₦{b.limit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                          isOverBudget
                            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                            : isNearLimit
                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        }`}
                      >
                        {isOverBudget ? (
                          <><AlertTriangle className="h-3.5 w-3.5" /> Over</>
                        ) : isNearLimit ? (
                          <><AlertTriangle className="h-3.5 w-3.5" /> {percentage}%</>
                        ) : (
                          <><CheckCircle2 className="h-3.5 w-3.5" /> {percentage}%</>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isOverBudget ? "bg-rose-500" : isNearLimit ? "bg-amber-500" : b.color
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="mt-3 flex justify-between text-xs font-bold text-slate-500">
                      <span>
                        Remaining:{" "}
                        <strong className={isOverBudget ? "text-rose-600" : "text-slate-800"}>
                          ₦{Math.abs(b.limit - b.spent).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                          {isOverBudget ? " over" : ""}
                        </strong>
                      </span>
                      <span>{percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ========================================== */}
      {/* CREATE BUDGET MODAL OVERLAY */}
      {/* ========================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create New Budget</h2>
                <p className="text-xs text-slate-500 mt-0.5">Set a monthly spending limit in Naira (₦) for a specific category.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category Name</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    name="category"
                    list="budget-categories"
                    type="text"
                    placeholder="e.g. Groceries & Food, Airtime & Data, Transport"
                    required
                    autoFocus
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 focus:border-cyan-500 focus:outline-none"
                  />
                  <datalist id="budget-categories">
                    {nigerianBudgetCategories.map((cat, index) => (
                      <option key={`budget-cat-${index}`} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Limit (₦)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400">₦</span>
                  <input
                    name="limit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-xl font-bold text-slate-900 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Display Icon</label>
                  <div className="relative">
                    <Shapes className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <select
                      name="iconName"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none appearance-none cursor-pointer"
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
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Theme Color</label>
                  <div className="relative">
                    <Palette className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <select
                      name="color"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none appearance-none cursor-pointer"
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}