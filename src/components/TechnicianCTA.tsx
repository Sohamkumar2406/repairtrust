"use client";

import React from "react";
import {
  Wrench,
  TrendingUp,
  MapPin,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

interface TechnicianCTAProps {
  onOpenTechnicianModal: () => void;
}

export function TechnicianCTA({ onOpenTechnicianModal }: TechnicianCTAProps) {
  const benefits = [
    {
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      title: "Direct Weekly Bank Payouts",
      desc: "Get settled directly into your bank account every Tuesday without delayed commission audits.",
    },
    {
      icon: <MapPin className="w-5 h-5 text-emerald-400" />,
      title: "Hyper-Local Bengaluru Jobs",
      desc: "Choose the exact localities you wish to serve (e.g. Koramangala, Indiranagar, HSR) to save travel time.",
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-emerald-400" />,
      title: "Zero Lead-Bidding Fees",
      desc: "Stop paying for wasted leads. We connect you directly with customers who have confirmed fault symptoms.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: "Digital Invoicing & Tool Support",
      desc: "Free mobile tools for line-item quotations, digital warranty certificates, and parts catalog access.",
    },
  ];

  return (
    <section id="technician-partner" className="py-16 md:py-24 bg-[#101828] text-white relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Pitch */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              Bengaluru Technician Partner Onboarding Open
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Grow Your Repair Business with RepairTrust.
            </h2>

            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Are you a skilled repair professional or workshop owner in Bengaluru? Join our curated network of certified technicians and earn consistent income with transparent payouts.
            </p>

            {/* Quick check list */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero joining or registration fee for verified professionals</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Onboarding within 24 to 48 hours following document verification</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Flexible working hours — accept jobs that fit your schedule</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={onOpenTechnicianModal}
                className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Join as a Technician
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:08048209801"
                className="px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                Partner Helpline: 080-4820-9801
              </a>
            </div>
          </div>

          {/* Right Column: 4 Perks Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3">
                  {b.icon}
                </div>
                <h4 className="font-bold text-sm text-white mb-1.5">{b.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
