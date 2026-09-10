// app/faq/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PiggyBank, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Menu, 
  X, 
  HelpCircle, 
  Shield, 
  CreditCard, 
  Smartphone, 
  Users,
  MessageSquare,
  LifeBuoy,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import Footer from "@/components/Footer";

export default function FAQPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [feedbackGiven, setFeedbackGiven] = useState<{ [key: number]: string }>({});

  const faqCategories = [
    {
      category: "Getting Started & Accounts",
      id: "getting-started",
      icon: Smartphone,
      items: [
        {
          q: "How do I connect my bank account securely?",
          a: "Connecting your bank account is simple and secure. Head over to the Accounts page in your dashboard, click 'Connect New Account', and follow the prompts via our secure partner, Plaid. You can link over 10,000+ financial institutions instantly."
        },
        {
          q: "Is my online banking login data secure?",
          a: "Yes, entirely secure. FinanceFlow uses read-only access powered by Plaid with 256-bit TLS encryption. We never see, handle, or store your actual online banking credentials or passwords."
        },
        {
          q: "Can I use FinanceFlow without linking a bank?",
          a: "Yes! While automatic bank syncing is a Pro feature, the Basic plan allows you to manually enter transactions, manage cash accounts, and build custom budgets completely on your own."
        }
      ]
    },
    {
      category: "Billing & Subscriptions",
      id: "billing",
      icon: CreditCard,
      items: [
        {
          q: "How does the 14-day free trial work?",
          a: "When you choose the Pro plan, you get full access to all automated features for 14 days completely free. You can cancel at any time before the trial ends and you will not be charged a single penny."
        },
        {
          q: "Can I change or cancel my subscription later?",
          a: "You can upgrade, downgrade, or cancel your subscription at any time directly through your Settings page. There are zero cancellation fees or lock-in contracts."
        },
        {
          q: "Do you offer refunds on annual plans?",
          a: "Yes, we offer a 30-day money-back guarantee on all annual plans. If FinanceFlow doesn't help you streamline your budgeting, contact support for a full, no-questions-asked refund."
        }
      ]
    },
    {
      category: "Security & Privacy",
      id: "security",
      icon: Shield,
      items: [
        {
          q: "Who has access to my personal financial data?",
          a: "Only you have access to your personal financial insights. Our employees cannot view your transaction history, account numbers, or balances unless explicitly requested by you for technical troubleshooting."
        },
        {
          q: "Do you sell my data to third-party advertisers?",
          a: "Never. FinanceFlow operates on a straightforward subscription model. We do not monetize your personal information or transaction patterns with third-party advertisers or brokers."
        }
      ]
    },
    {
      category: "Collaboration & Family",
      id: "collaboration",
      icon: Users,
      items: [
        {
          q: "Can I share my budget with my partner or family?",
          a: "Yes! Pro plan subscribers can invite a spouse or partner to collaborate on shared accounts, monitor joint spending thresholds, and track household goals together in real-time."
        },
        {
          q: "Are there separate permission levels for members?",
          a: "Currently, invited members have full collaborative access to the shared budgets to ensure maximum transparency, with administrative control remaining with the primary account owner."
        }
      ]
    }
  ];

  const handleFeedback = (index: number, type: string) => {
    setFeedbackGiven({ ...feedbackGiven, [index]: type });
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let globalIndexCounter = 0;

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
            <Link href="/pricing" className="hover:text-cyan-600 transition-colors">Pricing</Link>
            <Link href="/faq" className="text-cyan-600 font-bold">FAQ</Link>
            <Link href="/contact" className="hover:text-cyan-600 transition-colors">Contact Us</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/get-started" className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/10 active:scale-95">
              Get Started
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
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">Pricing</Link>
            <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-cyan-600 py-1">FAQ</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-700 hover:text-cyan-600 py-1">Contact Us</Link>
            <hr className="my-2 border-slate-100" />
            <div className="flex flex-col gap-3 pt-1">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full rounded-2xl border border-slate-200 py-3 text-center text-base font-bold text-slate-700">Log in</Link>
              <Link href="/get-started" onClick={() => setIsMobileMenuOpen(false)} className="w-full rounded-2xl bg-slate-900 py-3 text-center text-base font-bold text-white shadow-lg shadow-slate-900/20">Get Started Free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* --- Hero Header Section with Search & Quick Tags --- */}
      <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-24 lg:pt-52 lg:pb-28 px-4 sm:px-6 lg:px-8 text-center bg-white border-b border-slate-200/80">
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform blur-3xl sm:top-[-10rem]">
          <div className="aspect-[1155/678] w-[36rem] sm:w-[72.1875rem] bg-gradient-to-tr from-cyan-300 to-blue-500 opacity-20"></div>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="h-4 w-4" /> 24/7 Knowledge & Support Hub
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-10 font-medium">
            Find clear, comprehensive answers regarding bank security, account linking, billing cycles, and platform features.
          </p>

          {/* Search Input Bar */}
          <div className="relative max-w-xl mx-auto shadow-xl shadow-slate-200/50 rounded-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions (e.g., security, bank, refund, trial)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pl-12 pr-4 text-sm font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all"
            />
          </div>

          {/* Quick Search Tag Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-500">
            <span className="text-slate-400">Popular:</span>
            {["Bank sync", "Security", "Refund", "Pricing", "Partners"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- Category Tabs Navigation --- */}
      <div className="sticky top-[73px] z-40 bg-white/95 backdrop-blur border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="mx-auto max-w-4xl flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar">
          {["All", ...faqCategories.map(c => c.category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- FAQ Accordions Section --- */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-16">
          {faqCategories
            .filter((group) => activeCategory === "All" || group.category === activeCategory)
            .map((group, catIndex) => {
              const CatIcon = group.icon;

              const filteredItems = group.items.filter(
                (item) =>
                  item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.a.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredItems.length === 0) return null;

              return (
                <div key={catIndex} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 shadow-sm">
                      <CatIcon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">{group.category}</h2>
                  </div>

                  <div className="space-y-4">
                    {filteredItems.map((item, itemIndex) => {
                      const currentIndex = globalIndexCounter++;
                      const isOpen = openIndex === currentIndex;
                      const hasGivenFeedback = feedbackGiven[currentIndex];

                      return (
                        <div 
                          key={itemIndex}
                          className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-md"
                        >
                          <button
                            onClick={() => toggleAccordion(currentIndex)}
                            className="flex w-full items-center justify-between p-6 sm:p-8 text-left font-bold text-slate-900 hover:bg-slate-50/50 transition-colors"
                          >
                            <span className="pr-4 text-base sm:text-lg font-black">{item.q}</span>
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform ${isOpen ? "rotate-180 bg-cyan-50 text-cyan-600" : ""}`}>
                              <ChevronDown className="h-5 w-5" />
                            </div>
                          </button>

                          {isOpen && (
                            <div className="border-t border-slate-100 px-6 sm:px-8 py-6 text-slate-600 text-sm sm:text-base leading-relaxed bg-slate-50/30 animate-in fade-in">
                              <p className="mb-6">{item.a}</p>

                              {/* Was this helpful micro-widget */}
                              <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Was this article helpful?</span>
                                {hasGivenFeedback ? (
                                  <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                                    <CheckCircle2 className="h-4 w-4" /> Thanks for your feedback!
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => handleFeedback(currentIndex, 'yes')}
                                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                                    >
                                      <ThumbsUp className="h-3.5 w-3.5 text-cyan-600" /> Yes
                                    </button>
                                    <button 
                                      onClick={() => handleFeedback(currentIndex, 'no')}
                                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                                    >
                                      <ThumbsDown className="h-3.5 w-3.5 text-slate-400" /> No
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* --- Additional Help Resources Cards Grid --- */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">Support Channels</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Other ways we can assist you
            </h2>
            <p className="mt-3 text-slate-600">Choose your preferred channel to get quick answers from our experts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-8 text-center flex flex-col items-center justify-between transition-all hover:bg-white hover:shadow-xl">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 mx-auto mb-6">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Documentation</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">Explore our extensive guides and deep-dive technical manuals.</p>
              </div>
              <Link href="/features" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1">
                Browse Guides <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-8 text-center flex flex-col items-center justify-between transition-all hover:bg-white hover:shadow-xl">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mx-auto mb-6">
                  <MessageSquare className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Live Support Chat</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">Chat with our customer service team during working hours (8am - 5pm WAT).</p>
              </div>
              <Link href="/contact" className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                Start Chat <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-8 text-center flex flex-col items-center justify-between transition-all hover:bg-white hover:shadow-xl">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mx-auto mb-6">
                  <LifeBuoy className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Email Ticketing</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">Send us a detailed message. We guarantee a response in under 2 hours.</p>
              </div>
              <Link href="/contact" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
                Send Email <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Bottom CTA Section --- */}
      <section className="bg-slate-900 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 pointer-events-none"></div>
        <div className="mx-auto max-w-3xl relative z-10">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl mb-4">
            Ready to jump right in?
          </h2>
          <p className="text-base sm:text-xl text-slate-300 mb-10 font-medium">
            Create your free account today and experience seamless, secure financial tracking.
          </p>
          <Link
            href="/get-started"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-5 text-base font-black text-white shadow-xl shadow-cyan-500/25 transition-all hover:opacity-95 active:scale-95"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* --- Footer --- */}
      <Footer />
    </div>
  );
}