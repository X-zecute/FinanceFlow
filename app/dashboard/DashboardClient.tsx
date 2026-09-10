// app/(dashboard)/dashboard/DashboardClient.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UserMenu from "@/components/UserMenu";
import SpendingChart from "@/components/SpendingChart";
import {
  Search,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Zap,
  Send,
  Plus,
  FileText,
  Wallet,
  Loader2,
  Trash2,
  X,
  CheckCircle2
} from "lucide-react";
import { db } from "@/config/firebase";
import { collection, onSnapshot, query, orderBy, where, addDoc, deleteDoc, doc } from "firebase/firestore";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  type?: "expense" | "income";
  account?: string;
  status?: string;
}

interface Bill {
  id: string;
  name: string;
  date: string;
  amount: number;
  userEmail: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "bill" | "transaction" | "system";
  read: boolean;
}

export default function DashboardClient({ user }: { user: any }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isSubmittingBill, setIsSubmittingBill] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.email) {
      setTransactions([]);
      setBills([]);
      setIsLoading(false);
      return;
    }

    const txQuery = query(
      collection(db, "expenses"),
      where("userEmail", "==", session.user.email),
      orderBy("date", "desc")
    );

    const unsubTx = onSnapshot(txQuery, (snapshot) => {
      const fetched: Transaction[] = snapshot.docs.map((docSnap): Transaction => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          merchant: data.merchant || "Unknown",
          category: data.category || "General",
          amount: data.amount || 0,
          date: data.date || new Date().toISOString().split("T")[0],
          type: data.type === "income" ? ("income" as const) : ("expense" as const),
          account: data.account || "GTBank Savings",
          status: "Completed"
        };
      });
      setTransactions(fetched);
    }, (error) => console.error("Error fetching transactions:", error));

    const billsQuery = query(
      collection(db, "bills"),
      where("userEmail", "==", session.user.email),
      orderBy("date", "asc")
    );

    const unsubBills = onSnapshot(billsQuery, (snapshot) => {
      const fetchedBills = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || "Untitled Bill",
          date: data.date || "",
          amount: data.amount || 0,
          userEmail: data.userEmail
        };
      });
      setBills(fetchedBills);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching bills:", error);
      setIsLoading(false);
    });

    return () => {
      unsubTx();
      unsubBills();
    };
  }, [session, status]);

  const handleAddBill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingBill(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const date = formData.get("date") as string;
    const amount = parseFloat(formData.get("amount") as string);

    try {
      await addDoc(collection(db, "bills"), {
        name,
        date,
        amount,
        userEmail: session?.user?.email,
        createdAt: new Date().toISOString(),
      });
      setIsSubmittingBill(false);
      setIsAddBillOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error adding bill:", error);
      setIsSubmittingBill(false);
      alert("Failed to add bill.");
    }
  };

  const handleDeleteBill = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteDoc(doc(db, "bills", id));
      } catch (error) {
        console.error("Error deleting bill:", error);
        alert("Failed to delete bill.");
      }
    }
  };

  const handleExportStatement = () => {
    if (transactions.length === 0) {
      alert("No transaction records available to export.");
      return;
    }

    const headers = ["ID", "Merchant / Source", "Category", "Type", "Amount (NGN)", "Date", "Account", "Status"];
    const rows = transactions.map(tx => [
      tx.id,
      `"${tx.merchant.replace(/"/g, '""')}"`,
      `"${tx.category.replace(/"/g, '""')}"`,
      tx.type || "expense",
      tx.amount.toFixed(2),
      tx.date,
      `"${(tx.account || "").replace(/"/g, '""')}"`,
      tx.status || "Completed"
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `financial_statement_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const metrics = useMemo(() => {
    const income = transactions.filter(tx => tx.type === "income").reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
    const expenses = transactions.filter(tx => tx.type === "expense").reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
    return { income, expenses, count: transactions.length };
  }, [transactions]);

  const categorySpending = useMemo(() => {
    const breakdown: Record<string, number> = {};
    transactions.filter(tx => tx.type === "expense").forEach(tx => {
      const cat = tx.category || "General";
      breakdown[cat] = (breakdown[cat] || 0) + Math.abs(tx.amount);
    });
    return breakdown;
  }, [transactions]);
  
  const displayedTransactions = useMemo(() => {
    const queryLower = searchQuery.toLowerCase().trim();
    if (!queryLower) {
      return transactions.slice(0, 5);
    }
    return transactions.filter(tx => 
      tx.merchant.toLowerCase().includes(queryLower) || 
      tx.category.toLowerCase().includes(queryLower) ||
      (tx.account && tx.account.toLowerCase().includes(queryLower))
    );
  }, [transactions, searchQuery]);

  const realtimeNotifications = useMemo(() => {
    const list: NotificationItem[] = [
      {
        id: "sys-1",
        title: "Cloud Sync Active",
        message: "Firestore real-time listeners are fully synchronized.",
        time: "Just now",
        type: "system",
        read: false
      }
    ];

    bills.slice(0, 3).forEach((bill, idx) => {
      list.push({
        id: `bill-${bill.id || idx}`,
        title: `Upcoming Bill: ${bill.name}`,
        message: `₦${bill.amount.toLocaleString()} due on ${bill.date}.`,
        time: "Scheduled",
        type: "bill",
        read: false
      });
    });

    transactions.slice(0, 3).forEach((tx, idx) => {
      list.push({
        id: `tx-${tx.id || idx}`,
        title: `${tx.type === "income" ? "Income Received" : "Expense Recorded"}`,
        message: `${tx.merchant} - ₦${Math.abs(tx.amount).toLocaleString()}`,
        time: tx.date,
        type: "transaction",
        read: true
      });
    });

    return list;
  }, [bills, transactions]);

  return (
    <div className="w-full space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 relative">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between w-full gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || session?.user?.name?.split(' ')[0] || "User"}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here is what's happening with your finances today.</p>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..." 
              className="pl-10 pr-4 py-2.5 w-full sm:w-64 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 shadow-sm shrink-0 cursor-pointer transition-all"
            >
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse"></span>
            </button>

            {isNotificationsOpen && (
              <div className="fixed sm:absolute inset-x-4 sm:inset-x-auto sm:right-0 top-24 sm:top-auto sm:mt-2 w-auto sm:w-96 max-w-lg mx-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm">Notifications</h4>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black">
                      {realtimeNotifications.length} Live
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="py-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {realtimeNotifications.map((notif) => (
                    <div key={notif.id} className="flex items-start gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${notif.type === 'bill' ? 'bg-amber-100 text-amber-600' : notif.type === 'transaction' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                        {notif.type === 'bill' ? <Zap className="h-4 w-4" /> : notif.type === 'transaction' ? <Wallet className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-slate-900 truncate">{notif.title}</p>
                          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 break-words">{notif.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0">
            <UserMenu email={user?.email || session?.user?.email} />
          </div>
        </div>
      </header>

      {/* --- Action Bar --- */}
      <div className="flex flex-wrap items-center gap-3">
        <button 
          onClick={() => router.push("/dashboard/transactions/new")}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Record
        </button>
        <button 
          onClick={() => router.push("/dashboard/accounts")}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
        >
          <Send className="h-4 w-4 text-blue-600" /> Transfer
        </button>
        <button 
          onClick={handleExportStatement}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
        >
          <FileText className="h-4 w-4 text-emerald-600" /> Export Statement
        </button>
      </div>

      {/* --- Metric Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6 w-full">
        <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-500">Total Transactions</p>
            <Wallet className="h-5 w-5 text-slate-400" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 truncate">
            {metrics.count} <span className="text-sm font-normal text-slate-400">entries</span>
          </h2>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-500">Total Income</p>
            <ArrowUpRight className="h-5 w-5 text-emerald-500" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 truncate">
            ₦{metrics.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-500">Total Expenses</p>
            <ArrowDownRight className="h-5 w-5 text-rose-500" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 truncate">
            ₦{metrics.expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
        </div>
      </div>

      {/* --- Main Dashboard Content Grid --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8 w-full">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {searchQuery ? `Search Results (${displayedTransactions.length})` : "Recent Transactions"}
              </h3>
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Clear Search
                </button>
              ) : (
                <button 
                  onClick={() => router.push("/dashboard/transactions")}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  View All
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="py-12 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : displayedTransactions.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">
                {searchQuery ? `No transactions found matching "${searchQuery}".` : "No recent transactions found for your account."}
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 font-semibold px-2">Transaction</th>
                      <th className="pb-3 font-semibold px-2 hidden sm:table-cell">Category</th>
                      <th className="pb-3 font-semibold px-2 hidden md:table-cell">Status</th>
                      <th className="pb-3 font-semibold px-2">Date</th>
                      <th className="pb-3 font-semibold px-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {displayedTransactions.map((tx) => {
                      const isIncome = tx.type === "income";
                      return (
                        <tr key={tx.id} className="group hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl ${isIncome ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                                {isIncome ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                              </div>
                              <span className="font-bold text-slate-900 truncate max-w-[110px] sm:max-w-xs">{tx.merchant}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-2 hidden sm:table-cell">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 hidden md:table-cell">
                            <span className="text-xs font-semibold text-emerald-600">
                              {tx.status || "Completed"}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-slate-500 font-medium whitespace-nowrap">{tx.date}</td>
                          <td className={`py-3.5 px-2 text-right font-black whitespace-nowrap ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {isIncome ? `+₦${Math.abs(tx.amount).toLocaleString()}` : `-₦${Math.abs(tx.amount).toLocaleString()}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Spending by Category</h3>
              <MoreHorizontal className="h-5 w-5 text-slate-400 cursor-pointer" />
            </div>
            <SpendingChart data={categorySpending} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Upcoming Bills</h3>
              <button 
                onClick={() => setIsAddBillOpen(true)}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add Bill
              </button>
            </div>

            {bills.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No upcoming bills added yet.
              </div>
            ) : (
              <div className="space-y-3">
                {bills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/20 transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <Zap className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-bold text-slate-900 truncate">{bill.name}</p>
                        <p className="text-xs font-medium text-slate-500">Due {bill.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">₦{bill.amount.toLocaleString()}</span>
                      <button 
                        onClick={() => handleDeleteBill(bill.id, bill.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Bill"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isAddBillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-slate-900">Add Upcoming Bill</h3>
              <button 
                onClick={() => setIsAddBillOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddBill} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Bill Name / Service</label>
                <input 
                  name="name" 
                  type="text" 
                  placeholder="e.g. DSTV Subscription, Ikeja Electric" 
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Amount (₦)</label>
                <input 
                  name="amount" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Due Date</label>
                <input 
                  name="date" 
                  type="date" 
                  defaultValue={new Date().toISOString().split("T")[0]} 
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddBillOpen(false)}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmittingBill}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all disabled:opacity-70 cursor-pointer"
                >
                  {isSubmittingBill ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Bill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}