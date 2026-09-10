"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PiggyBank, 
  PieChart, 
  Zap, 
  Shield, 
  Smartphone, 
  TrendingUp, 
  Lock, 
  Bell, 
  ArrowRight, 
  Menu, 
  X,
  CheckCircle2
} from "lucide-react";
import Footer from "@/components/Footer";

export default function FeaturesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainFeatures = [
    {
      icon: PieChart,
      iconBg: "bg-cyan-100 text-cyan-600",
      title: "Real-time Visual Analytics",
      description: "Instantly see where your money goes with dynamic donut charts, weekly spending area graphs, and automated category breakdowns."
    },
    {
      icon: Zap,
      iconBg: "bg-blue-100 text-blue-600",
      title: "Smart Budgeting & Alerts",
      description: "Set custom spending limits per category. Get notified instantly when you approach 85% of your budget so you never overspend."
    },
    {
      icon: Shield,
      iconBg: "bg-emerald-100 text-emerald-600",
      title: "Bank-Level Security",
      description: "Your financial data is protected with 256-bit SSL encryption. We use secure, read-only connections via Plaid."
    },
    {
      icon: Smartphone,
      iconBg: "bg-purple-100 text-purple-600",
      title: "Multi-Device Sync",
      description: "Access your dashboard seamlessly across desktop, tablet, and mobile web browsers with lightning-fast data synchronization."
    },
    {
      icon: TrendingUp,
      iconBg: "bg-amber-100 text-amber-600",
      title: "Net Worth Tracking",
      description: "View all your checking, savings, credit cards, and investment accounts in one unified dashboard to monitor long-term wealth growth."
    },
    {
      icon: Bell,
      iconBg: "bg-rose-100 text-rose-600",
      title: "Custom Notifications",
      description: "Receive weekly summary reports, subscription renewal reminders, and urgent budget threshold alerts directly to your inbox."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-cyan-100 selection:text-cyan-900">
      
      {/* --- Navigation Bar --- */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md">
              <PiggyBank className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              FINANCE<span className="text-cyan-600">FLOW</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <Link href="/" className="hover:text-cyan-600 transition-colors">Home</Link>
            <Link href="/features" className="text-cyan-600 font-semibold">Features</Link>
            <Link href="/#pricing" className="hover:text-cyan-600 transition-colors">Pricing</Link>
            <Link href="/#faq" className="hover:text-cyan-600 transition-colors">FAQ</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Log in
            </Link>
            <Link href="/get-started" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-95">
              Get Started
            </Link>
          </div>

          <button 
            className="p-2 text-slate-600 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full flex flex-col gap-4 border-b border-slate-200 bg-white p-6 shadow-xl md:hidden">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600">Home</Link>
            <Link href="/features" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-cyan-600">Features</Link>
            <Link href="/#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600">Pricing</Link>
            <Link href="/#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600">FAQ</Link>
            <hr className="my-2 border-slate-100" />
            <div className="flex flex-col gap-4 pt-2">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center text-base font-semibold text-slate-600">Log in</Link>
              <Link href="/get-started" onClick={() => setIsMobileMenuOpen(false)} className="w-full rounded-full bg-slate-900 py-3 text-center text-base font-semibold text-white">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* --- Hero Header Section --- */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-44 lg:pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-600 mb-6 ring-1 ring-inset ring-cyan-500/20">
            Powerful Tools
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Everything you need to master your money.
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-8">
            Explore the advanced features built into FinanceFlow designed to make tracking, budgeting, and saving effortless.
          </p>
        </div>
      </section>

      {/* --- Features Grid Section --- */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="flex flex-col rounded-3xl border border-slate-100 bg-slate-50/50 p-8 shadow-sm transition-all hover:shadow-md hover:border-slate-200"
                >
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconBg}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 text-base leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- Security & Privacy Highlight Banner --- */}
      <section className="bg-slate-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-6 ring-1 ring-inset ring-cyan-400/30">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Your security is our absolute top priority.
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                We utilize high-grade security protocols to protect your personal information and financial records. Your data belongs to you, and we never sell it to third parties.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" /> 256-Bit SSL/TLS Encryption
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" /> Read-Only Bank Connections
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" /> SOC2 Type II Certified Partners
                </li>
              </ul>
            </div>
            
            <div className="rounded-3xl border border-slate-800 bg-slate-800/50 p-8 sm:p-10 shadow-xl flex flex-col justify-center">
              <h3 className="text-xl font-bold text-white mb-4">Have questions about safety?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Check out our documentation or read through our comprehensive FAQ section to learn more about how we safeguard your sensitive credentials.
              </p>
              <Link 
                href="/#faq" 
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View security FAQ <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Bottom CTA Section --- */}
      <section className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center border-t border-slate-200">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
            Ready to experience smarter financial tracking?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join thousands of users who have taken control of their budgets today.
          </p>
          <Link
            href="/get-started"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-95"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* --- Footer --- */}
     <Footer />
    </div>
  );
}