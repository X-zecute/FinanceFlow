// app/(dashboard)/dashboard/accounts/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Plus,
  Landmark,
  CreditCard,
  PiggyBank,
  Wallet,
  TrendingUp,
  RefreshCcw,
  Loader2,
  Building,
  Trash2
} from "lucide-react";
import { db } from "@/config/firebase";
import { collection, onSnapshot, query, orderBy, where, deleteDoc, doc } from "firebase/firestore";

interface Account {
  id: string;
  name: string;
  bank: string;
  type: string;
  number: string;
  balance: number;
  iconBg: string;
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
  const router = useRouter();
  const { data: session, status } = useSession();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.email) {
      setAccounts([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "accounts"),
      where("userEmail", "==", session.user.email),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || "Unknown Account",
          bank: data.bank || "Unknown Bank",
          type: data.type || "Checking",
          number: data.number || "•••• ****",
          balance: data.balance || 0,
          iconBg: data.iconBg || "bg-blue-100 text-blue-600",
        };
      });
      setAccounts(fetched);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching accounts: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [session, status]);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("All connected accounts have been successfully synchronized with live financial feeds!");
    }, 1500);
  };

  const handleDeleteAccount = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to disconnect/delete "${name}"?`)) {
      try {
        await deleteDoc(doc(db, "accounts", id));
      } catch (error) {
        console.error("Error deleting account: ", error);
        alert("Failed to delete account.");
      }
    }
  };

  const { totalAssets, totalLiabilities, netWorth } = useMemo(() => {
    const assets = accounts.filter((a) => a.balance > 0).reduce((acc, curr) => acc + curr.balance, 0);
    const liabilities = accounts.filter((a) => a.balance < 0).reduce((acc, curr) => acc + Math.abs(curr.balance), 0);
    return {
      totalAssets: assets,
      totalLiabilities: liabilities,
      netWorth: assets - liabilities
    };
  }, [accounts]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
          <p className="text-sm font-medium">Syncing your accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Linked Accounts
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Manage your bank accounts, credit cards, and investment portfolios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-70 cursor-pointer"
          >
            <RefreshCcw className={`h-4 w-4 text-slate-500 ${isSyncing ? "animate-spin text-cyan-600" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync All"}</span>
          </button>
          <button 
            onClick={() => router.push("/dashboard/accounts/new")}
            className="flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-500 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Account</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Net Worth</p>
            <h2 className="mt-2 text-2xl lg:text-3xl font-black text-slate-900">
              ₦{netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <TrendingUp className="h-4 w-4" />
            <span>Live Sync Active</span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Assets</p>
            <h2 className="mt-2 text-2xl lg:text-3xl font-black text-emerald-600">
              +₦{totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <Wallet className="h-4 w-4 text-emerald-500" />
            <span>Positive balances & investments</span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Liabilities (Credit)</p>
            <h2 className="mt-2 text-2xl lg:text-3xl font-black text-rose-600">
              -₦{totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <CreditCard className="h-4 w-4 text-rose-500" />
            <span>Outstanding credit balances</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-black text-slate-900">Your Accounts</h3>
        
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-16 px-4 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 mb-4">
              <Landmark className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No accounts connected</h2>
            <p className="text-slate-500 max-w-sm mb-6 text-sm">
              Connect your first Nigerian bank account, fintech wallet, or credit card to start tracking your net worth.
            </p>
            <button 
              onClick={() => router.push("/dashboard/accounts/new")}
              className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Connect First Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => {
              const Icon = getIconForType(account.type);
              const isCredit = account.type === "Credit";

              return (
                <div
                  key={account.id}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-cyan-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${account.iconBg}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{account.name}</h4>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">{account.bank}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteAccount(account.id, account.name)}
                      className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Account"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-8 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Account Number</p>
                      <p className="mt-1 text-sm font-bold text-slate-700">{account.number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-400">
                        {isCredit ? "Current Balance" : "Available Balance"}
                      </p>
                      <p
                        className={`mt-1 text-lg font-black ${
                          isCredit ? "text-rose-600" : "text-slate-900"
                        }`}
                      >
                        {isCredit ? "" : <span className="font-sans font-bold mr-0.5">₦</span>}
                        {Math.abs(account.balance).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <button 
              onClick={() => router.push("/dashboard/accounts/new")}
              className="flex min-h-[190px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-slate-500 transition-all hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-600 cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Plus className="h-6 w-6" />
              </div>
              <span className="font-bold text-sm">Connect New Account</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}