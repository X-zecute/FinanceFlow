"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PiggyBank, 
  Check, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Menu, 
  X, 
  ShieldCheck, 
  Zap, 
  Sparkles 
} from "lucide-react";
import Footer from "@/components/Footer";

export default function PricingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: "Basic",
      id: "tier-basic",
      href: "/get-started",
      priceMonthly: "$0",
      priceAnnual: "$0",
      description: "Essential tools for individuals starting their financial tracking journey.",
      features: [
        "Manual transaction entry",
        "Up to 3 basic category budgets",
        "Standard visual analytics",
        "Web and mobile responsive access",
        "Community support forum"
      ],
      mostPopular: false,
      cta: "Get Started Free",
      badge: null
    },
    {
      name: "Pro",
      id: "tier-pro",
      href: "/get-started",
      priceMonthly: "$7.99",
      priceAnnual: "$4.99",
      description: "Full automation, multi-account syncing, and advanced insights for smart savers.",
      features: [
        "Everything in Basic",
        "Automatic bank and card syncing via Plaid",
        "Unlimited custom budgets and categories",
        "Advanced monthly trend reporting",
        "Smart receipt scanning and auto-tagging",
        "Partner/Family account sharing (Multi-player)",
        "Priority 24/7 support"
      ],
      mostPopular: true,
      cta: "Start 14-Day Free Trial",
      badge: "MOST POPULAR"
    },
    {
      name: "Lifetime",
      id: "tier-lifetime",
      href: "/get-started",
      priceMonthly: "$149",
      priceAnnual: "$149",
      description: "Pay once, own forever. Unlock lifetime Pro access without recurring fees.",
      features: [
        "All Pro tier features included forever",
        "Zero recurring monthly or annual fees",
        "Early access to upcoming beta features",
        "Dedicated VIP onboarding call",
        "Custom export templates for tax prep"
      ],
      mostPopular: false,
      cta: "Get Lifetime Access",
      badge: "BEST VALUE"
    }
  ];

  const faqs = [
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your account settings page."
    },
    {
      question: "Is there a free trial for the Pro plan?",
      answer: "Absolutely! Every Pro plan subscription starts with a 14-day fully featured free trial. You won't be charged until the trial period ends."
    },
    {
      question: "How secure is my banking connection?",
      answer: "We use bank-grade 256-bit SSL encryption and rely on Plaid for read-only account linking. FinanceFlow never sees, handles, or stores your bank login credentials."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) as well as Apple Pay and Google Pay."
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
            <Link href="/pricing" className="text-cyan-600 font-semibold">Pricing</Link>
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
            <Link href="/features" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600">Features</Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-cyan-600">Pricing</Link>
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
      <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16 lg:pt-44 lg:pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-600 mb-6 ring-1 ring-inset ring-cyan-500/20">
            <Sparkles className="h-3.5 w-3.5" /> Simple, Transparent Plans
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Invest in your financial peace.
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-8">
            Choose the plan that fits your goals. Upgrade or cancel anytime with zero hidden fees.
          </p>

          {/* Billing Toggle Switch */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <span className={`text-sm font-semibold ${!isAnnual ? "text-slate-900" : "text-slate-500"}`}>
              Monthly billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAnnual ? "bg-cyan-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-1.5 ${isAnnual ? "text-slate-900" : "text-slate-500"}`}>
              Annual billing 
              <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">SAVE 35%</span>
            </span>
          </div>
        </div>
      </section>

      {/* --- Pricing Cards Section --- */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {tiers.map((tier) => {
              const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;

              return (
                <div
                  key={tier.id}
                  className={`flex flex-col justify-between rounded-3xl p-8 sm:p-10 transition-all ${
                    tier.mostPopular
                      ? "bg-slate-900 text-white shadow-xl border-2 border-cyan-500 relative lg:-translate-y-2"
                      : "bg-slate-50/50 border border-slate-200/80 text-slate-900 shadow-sm hover:shadow-md"
                  }`}
                >
                  {tier.badge && (
                    <div className="absolute top-0 right-0 bg-cyan-500 text-white text-[10px] font-extrabold px-3.5 py-1.5 rounded-bl-xl rounded-tr-3xl tracking-wider">
                      {tier.badge}
                    </div>
                  )}

                  <div>
                    <h3 className={`text-2xl font-bold ${tier.mostPopular ? "text-white" : "text-slate-900"}`}>
                      {tier.name}
                    </h3>
                    <p className={`mt-2 text-sm ${tier.mostPopular ? "text-slate-300" : "text-slate-500"}`}>
                      {tier.description}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className={`text-5xl font-extrabold tracking-tight ${tier.mostPopular ? "text-white" : "text-slate-900"}`}>
                        {price}
                      </span>
                      {price !== "$0" && price !== "$149" && (
                        <span className={`text-sm font-medium ${tier.mostPopular ? "text-slate-400" : "text-slate-500"}`}>
                          /month {isAnnual && "(billed annually)"}
                        </span>
                      )}
                    </div>

                    <ul className="mt-8 space-y-4">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                            tier.mostPopular ? "text-cyan-400" : "text-cyan-600"
                          }`} />
                          <span className={tier.mostPopular ? "text-slate-300" : "text-slate-700"}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10">
                    <Link
                      href={tier.href}
                      className={`block w-full rounded-xl py-4 text-center text-sm font-semibold shadow-sm transition-all active:scale-[0.98] ${
                        tier.mostPopular
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 shadow-cyan-500/25"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section className="bg-slate-50 py-16 sm:py-24 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-slate-600 text-base">Got questions? We've got answers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                  <HelpCircle className="h-5 w-5 text-cyan-500 flex-shrink-0" /> {faq.question}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Guarantee Banner --- */}
      <section className="bg-white py-12 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center flex flex-col sm:flex-row items-center justify-center gap-4 text-slate-700">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="text-sm sm:text-base font-medium">
            Backed by our 30-day money-back guarantee. If FinanceFlow doesn't help you save money, we'll refund your payment in full.
          </p>
        </div>
      </section>

      {/* --- Bottom CTA Section --- */}
      <section className="bg-slate-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Start tracking your expenses smarter today.
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            No credit card required for the Basic plan. Join thousands of users taking control.
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