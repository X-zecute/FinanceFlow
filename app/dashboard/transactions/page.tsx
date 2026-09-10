// app/(dashboard)/dashboard/transactions/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Search, 
  Download, 
  Plus, 
  Filter, 
  Loader2, 
  ArrowDownRight, 
  ArrowUpRight, 
  Wallet, 
  SlidersHorizontal,
  ArrowUpDown,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Trash2
} from "lucide-react";
import { db } from "@/config/firebase";
import { collection, onSnapshot, query, orderBy, where, deleteDoc, doc } from "firebase/firestore";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  type?: "expense" | "income";
  account?: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState<"all" | "expense" | "income">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.email) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "expenses"), 
      where("userEmail", "==", session.user.email),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Transaction[] = snapshot.docs.map((docSnap): Transaction => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          merchant: data.merchant || "Unknown Merchant",
          category: data.category || "General",
          amount: data.amount || 0,
          date: data.date || new Date().toISOString().split("T")[0],
          type: data.type === "income" ? "income" : "expense",
          account: data.account || "GTBank Savings (...8821)"
        };
      });
      setTransactions(fetched);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching transactions: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [session, status]);

  // Robust delete function targeting the "expenses" collection
  const handleDelete = async (id: string, merchant: string) => {
    if (window.confirm(`Are you sure you want to delete the transaction from "${merchant}"?`)) {
      try {
        await deleteDoc(doc(db, "expenses", id));
      } catch (error) {
        console.error("Error deleting transaction from Firestore: ", error);
        alert("Failed to delete transaction. Please check your Firestore security rules.");
      }
    }
  };

  const filteredTransactions = useMemo(() => {
    let result = transactions.filter(tx => {
      const matchesSearch = 
        tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || tx.category === selectedCategory;
      const matchesType = selectedType === "all" || tx.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    });

    return result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "highest") return b.amount - a.amount;
      if (sortBy === "lowest") return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchTerm, selectedCategory, selectedType, sortBy]);

  const metrics = useMemo(() => {
    const totalVolume = filteredTransactions.reduce((acc, curr) => {
      return curr.type === "income" ? acc + curr.amount : acc - curr.amount;
    }, 0);
    const count = filteredTransactions.length;
    return { totalVolume, count };
  }, [filteredTransactions]);

  const categories = [
    "All", 
    "Groceries & Food", 
    "Fuel & Transport", 
    "Airtime & Data", 
    "Electricity & Utilities", 
    "Housing & Rent", 
    "Owambe & Parties", 
    "Income"
  ];

  return (
    <div className="flex flex-col space-y-8 pb-12 w-full max-w-7xl mx-auto">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-slate-950">Transactions Ledger</h1>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 border border-blue-100">
              {transactions.length} Total Records
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">
            Real-time synchronization with your database. Review, filter, and audit all financial streams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/dashboard/reports")}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export Statement</span>
          </button>
          <button 
            onClick={() => router.push("/dashboard/transactions/new")}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Record</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Balance</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">₦{metrics.totalVolume.toLocaleString('en-US', {minimumFractionDigits: 2})}</h3>
            <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Database Synced
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Wallet className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Transaction Records</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.count} <span className="text-sm font-medium text-slate-500">entries</span></h3>
            <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Live feed active
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Ledger Status</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">Secure</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">Firestore Cloud Storage</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <SlidersHorizontal className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search merchant or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/60">
              <button
                onClick={() => setSelectedType("all")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${selectedType === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                All Flow
              </button>
              <button
                onClick={() => setSelectedType("expense")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${selectedType === "expense" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                Expenses
              </button>
              <button
                onClick={() => setSelectedType("income")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${selectedType === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                Income
              </button>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-xs font-bold text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="highest">Sort: Highest Amount</option>
                <option value="lowest">Sort: Lowest Amount</option>
              </select>
              <ArrowUpDown className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-semibold text-slate-500">Querying your Firestore records...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-24 text-center px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 mx-auto text-slate-400 mb-4">
              <Filter className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">No transactions located</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              No entries match your account or filter criteria. Try clearing your search parameters or add a new record.
            </p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setSelectedType("all"); }}
              className="mt-5 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Merchant / Source</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Account</th>
                  <th className="py-4 px-6">Date Logged</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === "income";
                  return (
                    <tr key={tx.id} className="group transition-colors hover:bg-slate-50/80">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${isIncome ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                            {isIncome ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                          </div>
                          <div>
                            <span className="block font-black text-slate-900 text-base">{tx.merchant}</span>
                            <span className="block text-xs font-semibold text-slate-400">{tx.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200/60">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-semibold text-xs">
                        {tx.account}
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-semibold text-xs">
                        {tx.date}
                      </td>
                      <td className={`py-4 px-6 text-right font-black text-base ${isIncome ? "text-emerald-600" : "text-slate-900"}`}>
                        {isIncome ? `+₦${Math.abs(tx.amount).toFixed(2)}` : `-₦${Math.abs(tx.amount).toFixed(2)}`}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button 
                          onClick={() => handleDelete(tx.id, tx.merchant)}
                          className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50/50 text-xs font-bold text-slate-500">
            <span>Showing <strong className="text-slate-900">{filteredTransactions.length}</strong> Live Database Entries</span>
            <span className="text-emerald-600 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Connection
            </span>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}