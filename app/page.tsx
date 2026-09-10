// app/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { 
  ArrowRight, 
  PiggyBank, 
  PieChart, 
  Shield, 
  Zap, 
  CheckCircle2,
  Star,
  Check,
  Menu,
  X,
  LineChart,
  HelpCircle,
  TrendingDown,
  Clock,
  Wallet,
  Users,
  Award,
  Sparkles,
  Lock,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-cyan-100 selection:text-cyan-900 overflow-x-hidden">
      
      {/* --- Navigation Bar --- */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <PiggyBank className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              FINANCE<span className="text-cyan-600">FLOW</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600">
            <Link href="/features" className="hover:text-cyan-600 transition-colors">Features</Link>
            <Link href="/how-it-works" className="hover:text-cyan-600 transition-colors">How it Works</Link>
            <Link href="/about" className="hover:text-cyan-600 transition-colors">About Us</Link>
            <Link href="/testimonials" className="hover:text-cyan-600 transition-colors">Testimonials</Link>
            <Link href="/pricing" className="hover:text-cyan-600 transition-colors">Pricing</Link>
            <Link href="/faq" className="hover:text-cyan-600 transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-cyan-600 transition-colors">Contact Us</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/get-started" className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/10 active:scale-95">
              Get Started Free
            </Link>
          </div>

          <button 
            className="p-2 text-slate-600 md:hidden rounded-xl hover:bg-slate-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full flex flex-col gap-3 border-b border-slate-200 bg-white p-6 shadow-2xl md:hidden animate-in fade-in slide-in-from-top-2">
            <Link href="/features" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">Features</Link>
            <Link href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">How it Works</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">About Us</Link>
            <Link href="/testimonials" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">Testimonials</Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">Pricing</Link>
            <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">FAQ</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">Contact Us</Link>
            <hr className="my-2 border-slate-100" />
            <div className="flex flex-col gap-3 pt-1">
              <Link href="/get-started" onClick={() => setIsMobileMenuOpen(false)} className="w-full rounded-2xl bg-slate-900 py-3 text-center text-base font-bold text-white shadow-lg shadow-slate-900/20">Get Started Free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28 lg:pt-52 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform blur-3xl sm:top-[-10rem]">
          <div className="aspect-[1155/678] w-[36rem] sm:w-[72.1875rem] bg-gradient-to-tr from-cyan-300 to-blue-500 opacity-25"></div>
        </div>

        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-bold uppercase tracking-wider mb-6 animate-bounce">
            <Sparkles className="h-4 w-4" /> Version 2.0 Live: Automated Insights & Bank Sync
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-none">
            Take total control of your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">financial future.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-xl leading-relaxed text-slate-600 font-medium">
            Track your expenses, manage your budgets, and watch your savings grow in real-time. The smartest way to manage your money all in one beautiful dashboard.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/get-started" className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-cyan-500/25 transition-all hover:opacity-95 active:scale-95">
              Start Tracking for Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/how-it-works" className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
              See How It Works
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>✓ No credit card required</span>
            <span>✓ 3-minute setup</span>
            <span>✓ Bank-grade encryption</span>
          </div>
        </div>
      </section>

      {/* --- Logo Cloud --- */}
      <section className="border-y border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-8">FEATURED AND TRUSTED BY INDUSTRY EXPERTS</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="text-2xl font-black tracking-tighter text-slate-800">TechCrunch</span>
            <span className="text-2xl font-black tracking-tighter text-slate-800">Forbes</span>
            <span className="text-2xl font-black tracking-tighter text-slate-800">Bloomberg</span>
            <span className="text-2xl font-black tracking-tighter text-slate-800">WIRED</span>
            <span className="text-2xl font-black tracking-tighter text-slate-800">Wall Street Journal</span>
          </div>
        </div>
      </section>

      {/* --- The Problem Section --- */}
      <section className="bg-slate-900 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">The Old Way vs. FinanceFlow</span>
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl mt-4 mb-6 leading-tight">
                Still using messy spreadsheets to track your money?
              </h2>
              <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
                Managing your finances shouldn't feel like a second job. Manual data entry, scattered accounts, and delayed updates make it impossible to know exactly where you stand.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                  <TrendingDown className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-slate-200 text-sm font-medium">Constant overspending because you lack real-time visibility into your disposable balance.</p>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                  <Clock className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-slate-200 text-sm font-medium">Wasting 5+ hours every month downloading CSV statements and categorizing rows manually.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/80 rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <PieChart className="h-64 w-64 text-white" />
               </div>
               <div className="relative z-10">
                 <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 mb-6 border border-cyan-500/30">
                   <Sparkles className="h-6 w-6" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-3">There's a better way.</h3>
                 <p className="text-slate-300 leading-relaxed mb-6">
                   FinanceFlow connects your accounts, automatically tags your spending, and alerts you before you break your monthly budget. Welcome to absolute financial peace of mind.
                 </p>
                 <Link href="/get-started" className="inline-flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                   Experience the dashboard <ArrowRight className="h-4 w-4" />
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Dashboard Preview Section --- */}
      <section className="bg-slate-50 py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">Live Preview</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Designed for absolute clarity and speed.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            A clean, modern interface built with cutting-edge web technology to give you lightning-fast performance across all devices.
          </p>
          
          <div className="relative mx-auto mt-12 max-w-5xl rounded-3xl border border-slate-200/80 bg-white p-3 sm:p-6 shadow-2xl shadow-slate-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <span className="text-xs font-bold text-slate-400">app.financeflow.io/dashboard</span>
              <div className="w-12"></div>
            </div>
            <div className="rounded-2xl bg-slate-900 p-8 sm:p-16 flex flex-col items-center justify-center min-h-[320px] sm:min-h-[450px] w-full text-slate-300 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-600/10 pointer-events-none"></div>
               <LineChart className="h-20 w-20 mb-6 text-cyan-400 animate-pulse" />
               <h4 className="text-xl font-bold text-white mb-2">Interactive Financial Command Center</h4>
               <p className="text-sm text-slate-400 max-w-md text-center">Real-time charts, automated ledger logging, net worth tracking, and smart budget meters.</p>
               <Link href="/get-started" className="mt-8 rounded-2xl bg-cyan-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 transition-all">
                 Explore Dashboard Now
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Core Features Grid --- */}
      <section id="features" className="bg-white py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">Powerful Capabilities</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Everything you need to master money
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Packed with robust tools designed to eliminate financial stress.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-slate-50/50 p-8 sm:p-10 transition-all hover:bg-white hover:shadow-xl hover:border-cyan-200 group">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 group-hover:scale-110 transition-transform">
                  <PieChart className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Visual Analytics</h3>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">Understand your spending habits instantly with clean, interactive breakdown charts categorized by merchants.</p>
              </div>

              <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-slate-50/50 p-8 sm:p-10 transition-all hover:bg-white hover:shadow-xl hover:border-blue-200 group">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Real-Time Budgeting</h3>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">Set monthly spending limits for custom categories and get immediate warnings before you overspend.</p>
              </div>

              <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-slate-50/50 p-8 sm:p-10 transition-all hover:bg-white hover:shadow-xl hover:border-emerald-200 group">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Bank-Grade Security</h3>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">Your financial records are fully encrypted. We use secure read-only protocols to sync safely without risk.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Feature Deep Dives (Alternating) --- */}
      <section className="bg-slate-50 py-20 sm:py-32 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-28">
          
          {/* Feature 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 h-72 sm:h-96 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <Wallet className="h-20 w-20 text-cyan-500 mb-4 opacity-80" />
              <p className="font-bold text-slate-800 text-lg">Multi-Account Synchronization</p>
              <p className="text-xs text-slate-400 mt-1">Checking, Savings, and Credit Cards unified.</p>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">Automated Syncing</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-4">
                Sync all your accounts in one place.
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
                Connect your checking, savings, credit cards, and investment portfolios securely. We automatically pull in your latest transactions so you never have to log data manually again.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700 font-bold text-sm"><Check className="h-5 w-5 text-cyan-500 shrink-0" /> Supports over 10,000+ major institutions</li>
                <li className="flex items-center gap-3 text-slate-700 font-bold text-sm"><Check className="h-5 w-5 text-cyan-500 shrink-0" /> Instant transaction auto-categorization</li>
                <li className="flex items-center gap-3 text-slate-700 font-bold text-sm"><Check className="h-5 w-5 text-cyan-500 shrink-0" /> Real-time net worth calculation</li>
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Collaboration</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-4">
                Budgeting made for partners and families.
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
                Managing money with a partner? Our secure sharing mode allows you to align on shared categories and monthly limits, keeping everyone fully on the same page.
              </p>
              <Link href="/get-started" className="text-blue-600 font-black hover:text-blue-700 flex items-center gap-2 text-sm">
                Explore Pro collaboration features <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="h-72 sm:h-96 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <Users className="h-20 w-20 text-blue-500 mb-4 opacity-80" />
              <p className="font-bold text-slate-800 text-lg">Shared Household Budgets</p>
              <p className="text-xs text-slate-400 mt-1">Real-time sync between accounts.</p>
            </div>
          </div>

        </div>
      </section>

      {/* --- Impact Metrics --- */}
      <section className="bg-cyan-600 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-cyan-500/60">
            <div className="py-4">
              <div className="text-5xl sm:text-6xl font-black tracking-tight mb-2">$500+</div>
              <div className="text-cyan-100 font-bold text-sm">Average monthly user savings</div>
            </div>
            <div className="py-4">
              <div className="text-5xl sm:text-6xl font-black tracking-tight mb-2">1M+</div>
              <div className="text-cyan-100 font-bold text-sm">Transactions automatically categorized</div>
            </div>
            <div className="py-4">
              <div className="text-5xl sm:text-6xl font-black tracking-tight mb-2">4.9/5</div>
              <div className="text-cyan-100 font-bold text-sm">Average App Store rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section id="how-it-works" className="bg-white py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">Simple Process</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              How FinanceFlow Works
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">Get up and running in less than three minutes.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center p-8 rounded-3xl border border-slate-100 bg-slate-50/50 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-500/25 mb-6 text-2xl font-black">1</div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Connect Accounts</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Securely link your bank accounts and credit cards for automated ledger syncing.</p>
            </div>
            <div className="flex flex-col items-center p-8 rounded-3xl border border-slate-100 bg-slate-50/50 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-500/25 mb-6 text-2xl font-black">2</div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Set Your Budgets</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Create custom category caps and monthly limits to keep spending fully in check.</p>
            </div>
            <div className="flex flex-col items-center p-8 rounded-3xl border border-slate-100 bg-slate-50/50 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-500/25 mb-6 text-2xl font-black">3</div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Watch Savings Grow</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Review deep analytics insights, optimize cash flow, and hit your target financial milestones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Security Highlight Section --- */}
      <section id="security" className="bg-slate-900 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">Uncompromising Protection</span>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl mt-4 mb-6 leading-tight">
                Your data security is our absolute priority.
              </h2>
              <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                We employ rigorous security measures designed to protect your sensitive financial information at every single layer of the application.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-200">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Lock className="h-4 w-4" />
                  </div>
                  <span>256-Bit SSL/TLS Bank-Grade Encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-200">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Shield className="h-4 w-4" />
                  </div>
                  <span>Read-Only Access (We never touch your funds)</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-200">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>SOC2 Type II Certified Data Centers</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-3xl p-8 sm:p-12 border border-slate-700 text-center">
              <Award className="h-16 w-16 text-emerald-400 mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-white mb-3">Trusted Infrastructure</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Powered by enterprise-grade cloud architecture with automated daily backups and zero-knowledge data privacy rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section id="testimonials" className="bg-slate-50 py-20 sm:py-32 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">Customer Success</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Loved by thousands of savers
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", role: "Freelancer", text: "FinanceFlow completely changed how I manage my variable income. The dashboard is stunning and effortlessly easy to use." },
              { name: "Marcus Reed", role: "Software Engineer", text: "Finally, an expense tracker that doesn't feel like a clunky spreadsheet. The automated category tagging saves me hours every week." },
              { name: "Emily Chen", role: "Small Business Owner", text: "The budget threshold alerts are an absolute lifesaver. I caught a double-charged subscription instantly thanks to the notifications." }
            ].map((testimonial, i) => (
              <div key={i} className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-6">
                    {[...Array(5)].map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-slate-700 italic mb-6 text-base leading-relaxed">"{testimonial.text}"</p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="font-black text-slate-900 text-base">{testimonial.name}</p>
                  <p className="text-xs font-bold text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Pricing Section --- */}
      <section id="pricing" className="bg-white py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">Flexible Pricing</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">Start for free, upgrade when you need advanced automation.</p>
          </div>
          
          <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-8 sm:p-12 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Basic</h3>
                <p className="mt-2 text-sm text-slate-500 font-medium">Perfect for individuals getting started with budgeting.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900">$0</span>
                  <span className="text-slate-500 text-sm font-bold">/month</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {['Manual transaction logging', 'Up to 3 active budgets', 'Standard analytics charts', 'Web & mobile dashboard access'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                      <Check className="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/get-started" className="mt-10 block w-full rounded-2xl border-2 border-slate-200 bg-white py-4 text-center text-sm font-black text-slate-900 hover:bg-slate-100 transition-colors shadow-sm">
                Get Started Free
              </Link>
            </div>

            <div className="rounded-3xl border-2 border-cyan-500 bg-slate-900 p-8 sm:p-12 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-cyan-500 text-white text-[10px] font-black tracking-wider px-4 py-1.5 rounded-bl-2xl">MOST POPULAR</div>
              <div>
                <h3 className="text-2xl font-black text-white">Pro</h3>
                <p className="mt-2 text-sm text-slate-300 font-medium">Automate your finances completely with bank syncing.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">$4.99</span>
                  <span className="text-slate-400 text-sm font-bold">/month</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {['Automatic bank account syncing', 'Unlimited custom budgets', 'Advanced trend reporting & CSV export', 'Smart receipt scanning & alerts'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-200">
                      <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/get-started" className="mt-10 block w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-center text-sm font-black text-white hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/25">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ Section (Interactive) --- */}
      <section id="faq" className="bg-slate-50 py-20 sm:py-32 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">Got Questions?</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                q: "Is my bank data secure with FinanceFlow?", 
                a: "Yes. We use industry-standard 256-bit SSL encryption to securely connect to your financial institutions. We never see or store your actual bank login credentials." 
              },
              { 
                q: "Can I collaborate on budgets with a partner?", 
                a: "Yes! The Pro plan allows you to invite a spouse, partner, or family member to collaborate on shared budgets and accounts in real time." 
              },
              { 
                q: "Do you support international banking institutions?", 
                a: "Currently, automated account syncing supports institutions across the US and Canada. You can easily use manual transaction entry globally from anywhere in the world." 
              },
              { 
                q: "How do I cancel my subscription if needed?", 
                a: "You can cancel your subscription at any time directly from your dashboard settings menu with a single click. No questions asked." 
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left font-black text-slate-900 hover:text-cyan-600 transition-colors"
                >
                  <span className="flex items-center gap-3 text-base sm:text-lg">
                    <HelpCircle className="h-5 w-5 text-cyan-500 shrink-0" /> {faq.q}
                  </span>
                  <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${activeFaq === index ? "rotate-90" : ""}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
    <section className="bg-slate-900 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 pointer-events-none"></div>
        <div className="mx-auto max-w-4xl relative z-10">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl mb-4">
            Ready to master your money?
          </h2>
          <p className="text-base sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
            Join thousands of users who are already saving more, spending smarter, and stressing less.
          </p>
          <Link href="/get-started" className="inline-flex w-full sm:w-auto justify-center items-center gap-3 rounded-2xl bg-cyan-500 px-10 py-5 text-base font-black text-white shadow-xl shadow-cyan-500/25 transition-all hover:bg-cyan-400 active:scale-95">
            Create Your Free Account
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* --- Professional Footer Component --- */}
      <Footer />
    </div>
  );
}