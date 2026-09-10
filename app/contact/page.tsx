// app/contact/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  PiggyBank, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  Loader2, 
  CheckCircle2,
  Clock
} from "lucide-react";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Extract form data
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    try {
      // Save message to Firestore database
      await addDoc(collection(db, "contact_messages"), {
        firstName,
        lastName,
        email,
        subject,
        message,
        status: "unread", // Useful for tracking if you've responded
        createdAt: new Date().toISOString(),
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        (e.target as HTMLFormElement).reset();
      }, 5000);
    } catch (error) {
      console.error("Error sending message to Firebase: ", error);
      setIsSubmitting(false);
      alert("Failed to send your message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-cyan-100 selection:text-cyan-900">
      
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
          
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">Get in Touch</span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              How can we help you?
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Have a question about our features, pricing, or need technical support? Our team is here to help you master your finances.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            
            {/* Contact Information (Left Column) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Email Support</h3>
                  <p className="mt-1 text-sm text-slate-500">Our team typically replies within 2 hours.</p>
                  <a href="mailto:support@financeflow.io" className="mt-3 inline-block text-sm font-bold text-cyan-600 hover:text-cyan-700">
                    support@financeflow.io
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Phone Call</h3>
                  <p className="mt-1 text-sm text-slate-500">Mon-Fri from 8am to 5pm (WAT).</p>
                  <a href="tel:+2348000000000" className="mt-3 inline-block text-sm font-bold text-blue-600 hover:text-blue-700">
                    +234 800 000 0000
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Office Location</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                    Innovation Hub<br />
                    Kubwa, Federal Capital Territory<br />
                    Nigeria
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form (Right Column) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                  <MessageSquare className="h-6 w-6 text-cyan-500" />
                  <h2 className="text-2xl font-black text-slate-900">Send us a message</h2>
                </div>

                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Message Sent!</h3>
                    <p className="text-slate-600 max-w-sm mx-auto">
                      Thanks for reaching out. We've received your message and will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">First Name</label>
                        <input
                          name="firstName"
                          type="text"
                          required
                          placeholder="John"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Last Name</label>
                        <input
                          name="lastName"
                          type="text"
                          required
                          placeholder="Doe"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Subject</label>
                      <select 
                        name="subject"
                        required
                        defaultValue=""
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select an option...</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing Inquiry</option>
                        <option value="sales">Sales & Partnerships</option>
                        <option value="feedback">Product Feedback</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Message</label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        placeholder="How can we help you today?"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-sm font-black text-white shadow-lg shadow-cyan-500/25 transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
        <Footer />
    </div>
  );
}