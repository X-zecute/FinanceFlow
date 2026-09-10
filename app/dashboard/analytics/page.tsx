// app/(dashboard)/dashboard/analytics/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, Calendar, Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { db } from "@/config/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  type: "expense" | "income";
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("Last 6 Months");

  // Fetch real-time transactions from Firestore
  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.email) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "expenses"),
      where("userEmail", "==", session.user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Transaction[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          merchant: data.merchant || "Unknown",
          category: data.category || "General",
          amount: data.amount || 0,
          date: data.date || new Date().toISOString().split("T")[0],
          type: (data.type === "income" ? "income" : "expense") as Transaction["type"]
        };
      });
      setTransactions(fetched);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching analytics data:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [session, status]);

  // --- Dynamic Filtering & Calculations Engine ---
  const analyticsData = useMemo(() => {
    const now = new Date(); // Current date context: 2026
    
    // Filter by time range
    const filtered = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      if (timeRange === "This Year") {
        return txDate.getFullYear() === now.getFullYear();
      } else if (timeRange === "Last 6 Months") {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        return txDate >= sixMonthsAgo;
      }
      return true; // All Time
    });

    // Total Income & Expenses
    const totalIncome = filtered.filter(tx => tx.type === "income").reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
    const totalExpenses = filtered.filter(tx => tx.type === "expense").reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
    
    // Monthly breakdown for Area Chart
    const monthlyMap: Record<string, { income: number; expenses: number }> = {};
    filtered.forEach(tx => {
      const dateObj = new Date(tx.date);
      const monthName = dateObj.toLocaleString('default', { month: 'short' });
      const year = dateObj.getFullYear();
      const key = `${monthName} ${year}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = { income: 0, expenses: 0 };
      }
      if (tx.type === "income") {
        monthlyMap[key].income += Math.abs(tx.amount);
      } else {
        monthlyMap[key].expenses += Math.abs(tx.amount);
      }
    });

    const trends = Object.keys(monthlyMap).map(month => ({
      month,
      income: monthlyMap[month].income,
      expenses: monthlyMap[month].expenses,
    }));

    // Category breakdown for Bar Chart
    const categoryMap: Record<string, number> = {};
    filtered.filter(tx => tx.type === "expense").forEach(tx => {
      const cat = tx.category || "General";
      categoryMap[cat] = (categoryMap[cat] || 0) + Math.abs(tx.amount);
    });

    const categories = Object.keys(categoryMap).map(cat => ({
      category: cat,
      current: categoryMap[cat],
      previous: Math.round(categoryMap[cat] * 0.9), // Estimated benchmark comparison
    })).sort((a, b) => b.current - a.current).slice(0, 6); // Top 6 categories

    // Averages & Savings Rate
    const activeMonths = Math.max(1, trends.length);
    const avgIncome = totalIncome / activeMonths;
    const avgExpense = totalExpenses / activeMonths;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return {
      avgIncome,
      avgExpense,
      savingsRate,
      trends,
      categories,
      totalIncome,
      totalExpenses
    };
  }, [transactions, timeRange]);

  // --- Export Live Report to CSV ---
  const handleExportReport = () => {
    if (transactions.length === 0) {
      alert("No data available to export.");
      return;
    }

    let csvContent = `data:text/csv;charset=utf-8,Financial Analytics Report (${timeRange})\n\n`;
    csvContent += `Summary Metrics\nAverage Monthly Income,₦${analyticsData.avgIncome.toFixed(2)}\nAverage Monthly Expenses,₦${analyticsData.avgExpense.toFixed(2)}\nNet Savings Rate,${analyticsData.savingsRate.toFixed(1)}%\n\n`;
    
    csvContent += `Monthly Cash Flow Trends\nMonth,Income (NGN),Expenses (NGN)\n`;
    analyticsData.trends.forEach(row => {
      csvContent += `${row.month},${row.income},${row.expenses}\n`;
    });

    csvContent += `\nCategory Spending Breakdown\nCategory,Amount (NGN)\n`;
    analyticsData.categories.forEach(row => {
      csvContent += `"${row.category}",${row.current}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financial_report_${timeRange.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium">Computing your financial analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 pb-12 w-full max-w-7xl mx-auto">
      {/* --- Header Section --- */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Analytics & Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Real Time financial performance and cash flow insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm">
            <Calendar className="h-4 w-4 text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer font-bold text-slate-900"
            >
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="This Year">This Year</option>
              <option value="All Time">All Time</option>
            </select>
          </div>
          <button 
            onClick={handleExportReport}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            <span>Export Report ({timeRange})</span>
          </button>
        </div>
      </header>

      {/* --- Key Insight Metrics Row --- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Monthly Income</p>
            <h2 className="mt-2 text-2xl lg:text-3xl font-black text-slate-900">
              ₦{analyticsData.avgIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="mt-1.5 text-xs text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> Database Synced
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Monthly Expenses</p>
            <h2 className="mt-2 text-2xl lg:text-3xl font-black text-slate-900">
              ₦{analyticsData.avgExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="mt-1.5 text-xs text-rose-600 font-bold flex items-center gap-1">
              <TrendingDown className="h-3.5 w-3.5" /> Database Synced
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <TrendingDown className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Savings Rate</p>
            <h2 className="mt-2 text-2xl lg:text-3xl font-black text-slate-900">
              {analyticsData.savingsRate.toFixed(1)}%
            </h2>
            <p className="mt-1.5 text-xs text-blue-600 font-bold flex items-center gap-1">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Active Cash Flow Ratio
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Wallet className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* --- Main Income vs Expenses Trend Chart --- */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Income vs. Expenses Trend</h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Comparing monthly cash flow performance for {timeRange.toLowerCase()}</p>
          </div>
          <div className="flex items-center gap-5 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-cyan-500" />
              <span className="text-slate-700">Income (₦)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-400" />
              <span className="text-slate-700">Expenses (₦)</span>
            </div>
          </div>
        </div>

        {analyticsData.trends.length === 0 ? (
          <div className="h-[340px] flex items-center justify-center text-sm font-medium text-slate-400">
            No transaction data found for this time range.
          </div>
        ) : (
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.trends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₦${val / 1000}k`} />
                <Tooltip
                  formatter={(value) => {
                    const raw = Array.isArray(value) ? value[0] : value;
                    const numericValue = Number(raw ?? 0);
                    return [`₦${numericValue.toLocaleString()}`, ""];
                  }}
                  contentStyle={{ borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="income" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                <Area type="monotone" dataKey="expenses" stroke="#64748b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpenses)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* --- Category Comparison Bar Chart Section --- */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-black text-slate-900">Top Spending Categories</h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Aggregated expense breakdown across categories</p>
        </div>

        {analyticsData.categories.length === 0 ? (
          <div className="h-[320px] flex items-center justify-center text-sm font-medium text-slate-400">
            No expense categories recorded yet.
          </div>
        ) : (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.categories} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₦${val / 1000}k`} />
                <Tooltip
                  formatter={(value) => {
                    const raw = Array.isArray(value) ? value[0] : value;
                    const numericValue = Number(raw ?? 0);
                    return [`₦${numericValue.toLocaleString()}`, ""];
                  }}
                  contentStyle={{ borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontWeight: "bold" }}
                />
                <Bar dataKey="current" fill="#2563eb" radius={[6, 6, 0, 0]} name="Total Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}