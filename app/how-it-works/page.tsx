"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PiggyBank, 
  Link as LinkIcon, 
  Sliders, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Menu, 
  X,
  CheckCircle2
} from "lucide-react";
import Footer from "@/components/Footer";

export default function HowItWorksPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const steps = [
    {
      step: "01",
      icon: LinkIcon,
      iconBg: "bg-cyan-100 text-cyan-600",
      title: "Securely Link Your Accounts",
      description: "Connect your bank accounts, credit cards, and investment portfolios in seconds. We use bank-grade 256-bit encryption and read-only access via Plaid, meaning your sensitive credentials are never stored on our servers."
    },
    {
      step: "02",
      icon: Sliders,
      iconBg: "bg-blue-100 text-blue-600",
      title: "Set Custom Budgets & Goals",
      description: "Define custom monthly spending limits for key categories like groceries, entertainment, and housing. Establish personalized savings targets to watch your wealth accumulate automatically."
    },
    {
      step: "03",
      icon: TrendingUp,
      iconBg: "bg-emerald-100 text-emerald-600",
      title: "Monitor, Optimize, and Save",
      description: "Watch transactions automatically categorize themselves in real time. Review interactive visual analytics and receive instant alerts before you exceed your budget thresholds."
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
            <Link href="/features" className="hover:text-cyan-600 transition-colors">Features</Link>
            <Link href="/how-it-works" className="text-cyan-600 font-semibold">How it Works</Link>
            <Link href="/#pricing" className="hover:text-cyan-600 transition-colors">Pricing</Link>
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
            <Link href="/features" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600">Features</Link>
            <Link href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-cyan-600">How it Works</Link>
            <Link href="/#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600">Pricing</Link>
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
            Simple Process
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            How FinanceFlow works for you.
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-8">
            Taking command of your financial future doesn't have to be complicated. Get fully set up in under three minutes.
          </p>
        </div>
      </section>

      {/* --- Detailed Steps Section --- */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="mx-auto max-w-5xl space-y-16 sm:space-y-24">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isEven = index % 2 === 1;

            return (
              <div 
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Visual Step Card / Icon Box */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  <div className="relative w-full max-w-md aspect-video sm:aspect-square rounded-3xl bg-slate-50 border border-slate-200/80 shadow-lg flex flex-col items-center justify-center p-8 text-center">
                    <span className="absolute top-6 left-6 text-4xl font-black text-slate-200">
                      {item.step}
                    </span>
                    <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${item.iconBg} shadow-inner mb-4`}>
                      <Icon className="h-10 w-10" />
                    </div>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Step {item.step}</p>
                  </div>
                </div>

                {/* Text Content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <span className="text-sm font-bold text-cyan-600 tracking-wider uppercase">Phase {item.step}</span>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2 mb-4">
                    {item.title}
                  </h2>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- Trust & Guarantee Section --- */}
      <section className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-6">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
            Zero risk, absolute transparency.
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            You can disconnect or delete your accounts at any time with a single click. Your data privacy is heavily guarded by industry-leading compliance protocols.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" /> No hidden fees
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" /> 14-day free trial on Pro
            </div>
          </div>
        </div>
      </section>

      {/* --- Bottom CTA Section --- */}
      <section className="bg-slate-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to take the first step?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Join thousands of users who have streamlined their financial workflows today.
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