"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { 
  PiggyBank, 
  Star, 
  Quote, 
  ArrowRight, 
  Menu, 
  X,
  CheckCircle2
} from "lucide-react";


export default function TestimonialsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Freelance Designer",
      avatar: "SJ",
      content: "FinanceFlow completely changed how I manage my variable income. The dashboard is beautiful, highly responsive, and makes tracking taxes and expenses effortless.",
      rating: 5,
      highlight: "Changed how I manage my variable income"
    },
    {
      name: "Marcus Reed",
      role: "Software Engineer",
      avatar: "MR",
      content: "Finally, an expense tracker that doesn't feel like an overgrown spreadsheet. The automated category tagging and real-time syncing save me hours every single week.",
      rating: 5,
      highlight: "Saves me hours every single week"
    },
    {
      name: "Emily Chen",
      role: "Small Business Owner",
      avatar: "EC",
      content: "The budget threshold alerts are an absolute lifesaver. I caught an accidental double-charged subscription instantly thanks to the real-time notification system.",
      rating: 5,
      highlight: "Caught a double-charged subscription instantly"
    },
    {
      name: "David Ross",
      role: "Product Manager",
      avatar: "DR",
      content: "I've tried a dozen budgeting apps over the years, but FinanceFlow strikes the perfect balance between clean visual design and deep analytics.",
      rating: 5,
      highlight: "Perfect balance between design and analytics"
    },
    {
      name: "Aisha Patel",
      role: "Marketing Director",
      avatar: "AP",
      content: "Collaborative budgeting with my spouse used to be a nightmare of text threads and receipts. Now we share an account view seamlessly. Worth every penny of Pro.",
      rating: 5,
      highlight: "Seamless collaborative budgeting"
    },
    {
      name: "Liam O'Connor",
      role: "Financial Analyst",
      avatar: "LO",
      content: "As someone who looks at numbers all day, I'm picky about financial software. FinanceFlow's charts and net worth tracking are top-tier.",
      rating: 5,
      highlight: "Top-tier charts and tracking"
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
            <Link href="/testimonials" className="text-cyan-600 font-semibold">Testimonials</Link>
            <Link href="/#pricing" className="hover:text-cyan-600 transition-colors">Pricing</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            
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
            <Link href="/testimonials" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-cyan-600">Testimonials</Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600">Pricing</Link>
            <hr className="my-2 border-slate-100" />
            <div className="flex flex-col gap-4 pt-2">
              
              <Link href="/get-started" onClick={() => setIsMobileMenuOpen(false)} className="w-full rounded-full bg-slate-900 py-3 text-center text-base font-semibold text-white">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* --- Hero Header Section --- */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-44 lg:pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-600 mb-6 ring-1 ring-inset ring-cyan-500/20">
            Customer Stories
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Loved by thousands of smart savers.
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-8">
            See how real people use FinanceFlow to eliminate financial stress, optimize budgets, and accomplish their long-term monetary goals.
          </p>
        </div>
      </section>

      {/* --- Metrics Highlights Banner --- */}
      <section className="bg-white py-12 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-slate-900">4.9 / 5.0</p>
              <div className="flex justify-center gap-1 text-amber-400 my-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm text-slate-500">Average rating across 2,400+ reviews</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-slate-900">98%</p>
              <p className="text-sm text-slate-500 mt-2">Customer retention and satisfaction rate</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-slate-900">$12M+</p>
              <p className="text-sm text-slate-500 mt-2">Total tracked monthly budget volume</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Testimonials Grid --- */}
      <section className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div 
                key={index}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-slate-200" />
                  </div>
                  
                  <h3 className="text-base font-bold text-slate-900 mb-2">"{item.highlight}"</h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                    {item.content}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 font-bold text-sm">
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Bottom CTA Section --- */}
      <section className="bg-slate-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Join thousands of satisfied savers today.
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Start your 14-day free trial and see how FinanceFlow simplifies your finances.
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