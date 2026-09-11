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

  const handleExportStatement = () => { /* Export implementation */ };

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
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-500 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Record
          </button>
        </div>
      </header>

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
                    <input name="category" list="category-options" required placeholder="Select..." className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm focus:border-blue-500 focus:outline-none" />
                    <datalist id="category-options">
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
                    <input name="account" list="account-options-list" required placeholder="Select account..." className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm focus:border-blue-500 focus:outline-none" />
                    <datalist id="account-options-list">
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