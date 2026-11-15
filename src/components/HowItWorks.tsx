"use client";

import React, { useState } from "react";
import {
  FileText,
  BadgePercent,
  CheckCircle2,
  Wrench,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Eye,
} from "lucide-react";

interface HowItWorksProps {
  onStartBooking: () => void;
  onOpenTechnician: () => void;
}

export function HowItWorks({ onStartBooking, onOpenTechnician }: HowItWorksProps) {
  const [activePersona, setActivePersona] = useState<"customer" | "technician">("customer");

  const customerSteps = [
    {
      step: "01",
      title: "Tell Us Your Problem",
      desc: "Select your appliance or device, describe the breakdown or select common symptoms, and specify your Bengaluru locality.",
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      detail: "Takes less than 60 seconds. No advance fee required.",
      pill: "Doorstep Request",
    },
    {
      step: "02",
      title: "Receive Technician Quotations",
      desc: "Verified local specialists examine your issue and send transparent line-item quotes with diagnostic, labor, and spare parts estimates.",
      icon: <BadgePercent className="w-6 h-6 text-blue-600" />,
      detail: "Direct quotes with zero hidden markups.",
      pill: "Transparent Pricing",
    },
    {
      step: "03",
      title: "Compare and Select",
      desc: "Review technician trade certifications, warranty coverage, and price breakdowns before confirming your preferred professional.",
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      detail: "100% control with zero pressure to accept.",
      pill: "Verified Choice",
    },
    {
      step: "04",
      title: "Get Your Repair Completed",
      desc: "Your technician arrives with calibrated equipment, executes the repair, runs a live demonstration test, and issues your digital warranty card.",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      detail: "Pay securely after satisfaction via UPI, Card, or Cash.",
      pill: "Guaranteed Satisfaction",
    },
  ];

  const technicianSteps = [
    {
      step: "01",
      title: "Register & Complete Verification",
      desc: "Submit your government ID, trade credentials, and service expertise for quick Bengaluru partner onboarding.",
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      detail: "Verified within 24 hours.",
      pill: "Free Registration",
    },
    {
      step: "02",
      title: "Receive Local Leads in Your Area",
      desc: "Get notified of repair requests in your preferred Bengaluru pincodes (Koramangala, HSR, Indiranagar, etc.).",
      icon: <Smartphone className="w-6 h-6 text-blue-600" />,
      detail: "Zero lead-purchase bidding wars.",
      pill: "Hyper-Local Jobs",
    },
    {
      step: "03",
      title: "Submit Transparent Quotations",
      desc: "Provide fair labor and parts estimates using our standardized transparent quotation builder.",
      icon: <BadgePercent className="w-6 h-6 text-indigo-600" />,
      detail: "Clear commission structure.",
      pill: "Direct Estimates",
    },
    {
      step: "04",
      title: "Complete Job & Get Fast Payouts",
      desc: "Execute the doorstep service, generate the digital invoice, and receive direct weekly bank deposits.",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      detail: "Reliable, predictable technician earnings.",
      pill: "Direct Settlement",
    },
  ];

  const currentSteps = activePersona === "customer" ? customerSteps : technicianSteps;

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Simple • Transparent • Reliable
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            How RepairTrust Works
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            No endless phone calls, no surprise bills, and no unqualified handymen. A streamlined process from quotation to guaranteed completion.
          </p>

          {/* Persona Switcher Toggle */}
          <div className="mt-6 inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActivePersona("customer")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activePersona === "customer"
                  ? "bg-[#101828] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Customers
            </button>
            <button
              type="button"
              onClick={() => setActivePersona("technician")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activePersona === "technician"
                  ? "bg-[#101828] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Technicians
            </button>
          </div>
        </div>

        {/* 4 Steps Grid */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-28 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-emerald-200 via-slate-200 to-emerald-200 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {currentSteps.map((item) => (
              <div
                key={item.step}
                className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-black text-slate-300">
                      {item.step}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.pill}
                    </span>
                  </div>

                  {/* Icon Circle */}
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center mb-4">
                    {item.icon}
                  </div>

                  {/* Title & Desc */}
                  <h3 className="font-bold text-base text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA trigger */}
        <div className="mt-12 text-center">
          {activePersona === "customer" ? (
            <button
              onClick={onStartBooking}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#101828] hover:bg-[#1E293B] text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all"
            >
              <span>Request Quotations Now</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          ) : (
            <button
              onClick={onOpenTechnician}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all"
            >
              <span>Join as a Technician</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
