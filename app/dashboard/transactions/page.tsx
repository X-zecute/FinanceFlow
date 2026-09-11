// app/(dashboard)/dashboard/transactions/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { 
  Search, Download, Plus, Filter, Loader2, ArrowDownRight, 
  ArrowUpRight, Wallet, SlidersHorizontal, ArrowUpDown, 
  FileSpreadsheet, CheckCircle2, Clock, Trash2, Landmark, 
  Building, Tag, Calendar, CreditCard, X 
} from "lucide-react";
import { db } from "@/config/firebase";
import { collection, onSnapshot, query, orderBy, where, deleteDoc, doc, addDoc } from "firebase/firestore";

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
  const { data: session, status } = useSession();

  // --- State: Data ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userAccounts, setUserAccounts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- State: Filters ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState<"all" | "expense" | "income">("all");
  const [selectedAccount, setSelectedAccount] = useState("All Accounts");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  // --- State: Modal Form ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");

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

  const defaultCategories = [
    "Groceries & Food", "Fuel & Transport", "Airtime & Data", "Electricity & Utilities", 
    "Housing & Rent", "Owambe & Parties", "Entertainment", "Healthcare", 
    "Education", "Salary / Income", "Business / Freelance", "Investments"
  ];

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.email) {
      setTransactions([]);
      setUserAccounts([]);
      setIsLoading(false);
      return;
    }

    const qTx = query(collection(db, "expenses"), where("userEmail", "==", session.user.email), orderBy("date", "desc"));
    const unsubTx = onSnapshot(qTx, (snapshot) => {
      const fetched: Transaction[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        merchant: docSnap.data().merchant || "Unknown Merchant",
        category: docSnap.data().category || "General",
        amount: docSnap.data().amount || 0,
        date: docSnap.data().date || new Date().toISOString().split("T")[0],
        type: docSnap.data().type === "income" ? "income" : "expense",
        account: docSnap.data().account || "Default Account"
      }));
      setTransactions(fetched);
      setIsLoading(false);
    });

    const qAcc = query(collection(db, "accounts"), where("userEmail", "==", session.user.email));
    const unsubAcc = onSnapshot(qAcc, (snapshot) => {
      setUserAccounts(snapshot.docs.map(doc => `${doc.data().name} (${doc.data().bank})`));
    });

    return () => { unsubTx(); unsubAcc(); };
  }, [session, status]);

  const handleDelete = async (id: string, merchant: string) => {
    if (window.confirm(`Are you sure you want to delete the transaction from "${merchant}"?`)) {
      await deleteDoc(doc(db, "expenses", id));
    }
  };

  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await addDoc(collection(db, "expenses"), {
        amount: parseFloat(formData.get("amount") as string),
        merchant: formData.get("merchant"),
        category: formData.get("category"),
        date: formData.get("date"),
        account: formData.get("account"),
        type: transactionType,
        userEmail: session?.user?.email || "unknown",
        createdAt: new Date().toISOString(),
      });
      setIsSubmitting(false);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleExportStatement = () => {
    if (transactions.length === 0) {
      alert("No transaction records available to export.");
      return;
    }

    const headers = ["ID", "Merchant / Source", "Category", "Type", "Amount (NGN)", "Date", "Account"];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      `"${tx.merchant.replace(/"/g, '""')}"`,
      `"${tx.category.replace(/"/g, '""')}"`,
      tx.type || "expense",
      tx.amount.toFixed(2),
      tx.date,
      `"${(tx.account || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_statement_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = useMemo(() => {
    let result = transactions.filter(tx => {
      const matchesSearch = tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || tx.category === selectedCategory;
      const matchesType = selectedType === "all" || tx.type === selectedType;
      const matchesAccount = selectedAccount === "All Accounts" || tx.account?.includes(selectedAccount);
      return matchesSearch && matchesCategory && matchesType && matchesAccount;
    });

    return result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "highest") return b.amount - a.amount;
      if (sortBy === "lowest") return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchTerm, selectedCategory, selectedType, selectedAccount, sortBy]);

  const metrics = useMemo(() => {
    const totalVolume = filteredTransactions.reduce((acc, curr) => curr.type === "income" ? acc + curr.amount : acc - curr.amount, 0);
    return { totalVolume, count: filteredTransactions.length };
  }, [filteredTransactions]);

  const categories = ["All", ...defaultCategories.slice(0, 7)];

  return (
    <div className="flex flex-col space-y-8 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 relative">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-slate-950">Transactions Ledger</h1>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 border border-blue-100">
              {transactions.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">Real-time synchronization with your database.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button 
            onClick={handleExportStatement}
            className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-600" /> Export CSV
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-500 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Record
          </button>
        </div>
      </header>

      {/* --- Filter & Search Controls --- */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search merchant or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>

          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm font-semibold text-slate-700 focus:outline-none"
          >
            {categories.map((cat, idx) => (
              <option key={`filter-cat-${idx}`} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm font-semibold text-slate-700 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* --- Transaction Table Section --- */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Wallet className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-base font-bold text-slate-800">No transaction records found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or add a new record.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase text-xs tracking-wider">
                  <th className="py-4 px-6 font-semibold">Merchant / Source</th>
                  <th className="py-4 px-6 font-semibold">Category</th>
                  <th className="py-4 px-6 font-semibold">Account</th>
                  <th className="py-4 px-6 font-semibold">Date</th>
                  <th className="py-4 px-6 font-semibold text-right">Amount</th>
                  <th className="py-4 px-6 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === "income";
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isIncome ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                            {isIncome ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                          </div>
                          <span className="font-bold text-slate-900">{tx.merchant}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium text-xs">{tx.account || "Default Account"}</td>
                      <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">{tx.date}</td>
                      <td className={`py-4 px-6 text-right font-black whitespace-nowrap ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {isIncome ? `+₦${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `-₦${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => handleDelete(tx.id, tx.merchant)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Record"
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
      </div>

      {/* ========================================== */}
      {/* ADD TRANSACTION MODAL OVERLAY */}
      {/* ========================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">New Transaction</h2>
                <p className="text-xs text-slate-500 mt-0.5">Record and categorize your cash flow.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-5">
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setTransactionType("expense")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    transactionType === "expense" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <ArrowDownRight className="h-4 w-4" /> Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType("income")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    transactionType === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <ArrowUpRight className="h-4 w-4" /> Income
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Amount (₦)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400">₦</span>
                  <input name="amount" type="number" step="0.01" required autoFocus className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-xl font-bold focus:border-blue-500 focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Merchant / Title</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input name="merchant" type="text" required placeholder="e.g. Shoprite, Netflix" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input name="category" list="category-options-page" required placeholder="Select..." className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm focus:border-blue-500 focus:outline-none" />
                    <datalist id="category-options-page">
                      {defaultCategories.map((cat, idx) => (
                        <option key={`tx-cat-${idx}`} value={cat} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Account Source</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input name="account" list="account-options-page-list" required placeholder="Select account..." className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm focus:border-blue-500 focus:outline-none" />
                    <datalist id="account-options-page-list">
                      {userAccounts.map((acc, index) => (
                        <option key={`tx-acc-${index}`} value={acc} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition-all disabled:opacity-70">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}