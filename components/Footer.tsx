// components/Footer.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PiggyBank, 
  ArrowRight, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Heart 
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API call for newsletter subscription
    setIsSubscribed(true);
    setEmail("");
    
    setTimeout(() => {
      setIsSubscribed(false);
    }, 6000);
  };

  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-900 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-slate-900">
          
          {/* Brand Column (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <PiggyBank className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                FINANCE<span className="text-cyan-500">FLOW</span>
              </span>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The intelligent financial command center built to eliminate budgeting friction, track real-time expenses, and secure your financial future.
            </p>

            <div className="flex items-center gap-6 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> SOC2 Certified
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-cyan-500" /> 256-Bit SSL
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Platform</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/features" className="hover:text-cyan-400 transition-colors">Features</Link></li>
              <li><Link href="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-cyan-400 transition-colors">Help Center / FAQ</Link></li>
            </ul>
          </div>

          {/* Legal / Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Support & Legal</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Stay Updated</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to our weekly newsletter for expert money-saving tips and product updates.
            </p>
            
            {isSubscribed ? (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-bold text-emerald-400 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-xs font-bold text-white placeholder:font-normal placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-cyan-500 py-2.5 text-xs font-black text-slate-950 transition-all hover:bg-cyan-400 active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} FinanceFlow Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="h-3.5 w-3.5 text-rose-500 fill-current" /> for better financial futures.
          </p>
        </div>

      </div>
    </footer>
  );
}