// app/about/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PiggyBank, 
  ArrowRight, 
  Menu, 
  X, 
  Target, 
  Eye, 
  Heart, 
  ShieldCheck, 
  Users, 
  Globe, 
  Award, 
  Sparkles 
} from "lucide-react";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <Link href="/" className="hover:text-cyan-600 transition-colors">Home</Link>
            <Link href="/features" className="hover:text-cyan-600 transition-colors">Features</Link>
            <Link href="/about" className="text-cyan-600 font-bold">About Us</Link>
            <Link href="/pricing" className="hover:text-cyan-600 transition-colors">Pricing</Link>
            <Link href="/faq" className="hover:text-cyan-600 transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-cyan-600 transition-colors">Contact Us</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/get-started" className="text-sm font-bold text-slate-700 hover:text-cyan-600 transition-colors px-3 py-2">
              Log in
            </Link>
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

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full flex flex-col gap-3 border-b border-slate-200 bg-white p-6 shadow-2xl md:hidden animate-in fade-in slide-in-from-top-2">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">Home</Link>
            <Link href="/features" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">Features</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-cyan-600 py-1">About Us</Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">Pricing</Link>
            <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">FAQ</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">Contact Us</Link>
            <hr className="my-2 border-slate-100" />
            <div className="flex flex-col gap-3 pt-1">
              <Link href="/get-started" onClick={() => setIsMobileMenuOpen(false)} className="w-full rounded-2xl border border-slate-200 py-3 text-center text-base font-bold text-slate-700">Log in</Link>
              <Link href="/get-started" onClick={() => setIsMobileMenuOpen(false)} className="w-full rounded-2xl bg-slate-900 py-3 text-center text-base font-bold text-white shadow-lg shadow-slate-900/20">Get Started Free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* --- Hero Header --- */}
      <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28 lg:pt-52 lg:pb-32 px-4 sm:px-6 lg:px-8 text-center bg-white border-b border-slate-200/80">
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform blur-3xl sm:top-[-10rem]">
          <div className="aspect-[1155/678] w-[36rem] sm:w-[72.1875rem] bg-gradient-to-tr from-cyan-300 to-blue-500 opacity-20"></div>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="h-4 w-4" /> About FinanceFlow
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl mb-6 leading-none">
            Empowering everyone to master <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">their money.</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
            We’re building the ultimate intelligent financial command center to remove the friction, anxiety, and guesswork from personal budgeting.
          </p>
        </div>
      </section>

      {/* --- Mission & Vision Section --- */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 mb-6">
                <Target className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">Our Mission</h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                To democratize financial wellness by providing modern, frictionless, and secure tools that give individuals absolute clarity over their income, expenses, and long-term savings goals.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600">
              <span>✓ Focused on user empowerment</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-6">
                <Eye className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">Our Vision</h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                A world where financial stress is a thing of the past. We envision a future where proactive insights and automated tracking make managing money feel effortless and intuitive for everyone.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <span>✓ Building for tomorrow</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Core Values Section --- */}
      <section className="bg-slate-900 py-20 sm:py-32 px-4 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">What Drives Us</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Our Core Values
            </h2>
            <p className="mt-3 text-slate-300">The foundational principles that guide every feature we build.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-800/50 p-8 sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 mb-6 border border-cyan-500/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Uncompromising Trust</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your data security is paramount. We protect your information with state-of-the-art encryption and strict privacy protocols.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-800/50 p-8 sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 mb-6 border border-blue-500/30">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">User-First Simplicity</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Finance shouldn't be complicated. We obsess over interface design to make money management clean, fast, and enjoyable.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-800/50 p-8 sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-6 border border-emerald-500/30">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Continuous Innovation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We constantly push the boundaries of web technology to bring you real-time bank syncing and automated insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Stats Section --- */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="py-4">
              <div className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 mb-2">10K+</div>
              <div className="text-slate-500 font-bold text-sm">Supported financial institutions</div>
            </div>
            <div className="py-4">
              <div className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 mb-2">99.9%</div>
              <div className="text-slate-500 font-bold text-sm">Platform uptime reliability</div>
            </div>
            <div className="py-4">
              <div className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 mb-2">1M+</div>
              <div className="text-slate-500 font-bold text-sm">Transactions tracked monthly</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Bottom CTA Section --- */}
      <section className="bg-slate-900 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 pointer-events-none"></div>
        <div className="mx-auto max-w-3xl relative z-10">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-base sm:text-xl text-slate-300 mb-10 font-medium">
            Join thousands of users who trust FinanceFlow to manage their money every day.
          </p>
          <Link
            href="/get-started"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-5 text-base font-black text-white shadow-xl shadow-cyan-500/25 transition-all hover:opacity-95 active:scale-95"
          >
            Get Started For Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* --- Footer --- */}
      <Footer />
    </div>
  );
}