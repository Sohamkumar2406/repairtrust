"use client";

import React from "react";
import {
  ShieldCheck,
  BadgePercent,
  Star,
  FileText,
  Clock,
  Headphones,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";

interface WhyRepairTrustProps {
  onLearnMore?: () => void;
}

export function WhyRepairTrust({ onLearnMore }: WhyRepairTrustProps) {
  const pillars = [
    {
      id: "verified-pros",
      title: "Verified Professionals",
      tagline: "Rigorous 4-tier technician screening",
      description:
        "Every technician undergoes strict government ID (Aadhaar) checks, police verification, and a practical technical trade assessment before ever entering a customer's home in Bengaluru.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      highlight: "Aadhaar & Police Background Checked",
      badge: "Zero Compromise",
      accentBg: "bg-emerald-50 text-emerald-700",
    },
    {
      id: "transparent-quotations",
      title: "Transparent Quotations",
      tagline: "Every rupee explained upfront",
      description:
        "No inflated estimates or surprise bills after dismantling your device. You receive clear line-item breakdowns: standard inspection fee, labor cost, and genuine parts with MRPs.",
      icon: <BadgePercent className="w-6 h-6 text-blue-600" />,
      highlight: "Standardized Line-Item Breakdown",
      badge: "No Hidden Costs",
      accentBg: "bg-blue-50 text-blue-700",
    },
    {
      id: "customer-reviews",
      title: "Customer Reviews",
      tagline: "Authentic feedback from real bookings",
      description:
        "Only verified customers who have completed a booking can submit ratings and feedback. We operate a zero-tolerance policy against fake reviews or incentivized ratings.",
      icon: <Star className="w-6 h-6 text-amber-500" />,
      highlight: "100% Verified Job Feedback Loop",
      badge: "Real Experiences",
      accentBg: "bg-amber-50 text-amber-700",
    },
    {
      id: "digital-repair-records",
      title: "Digital Repair Records",
      tagline: "Your appliance history saved permanently",
      description:
        "Never lose a warranty slip again. Every job logs replaced spare part serial numbers, technician signatures, diagnostic logs, and digital invoices accessible via your phone.",
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
      highlight: "Digital Certificates & Part Serial Logs",
      badge: "Paperless Vault",
      accentBg: "bg-indigo-50 text-indigo-700",
    },
    {
      id: "warranty-information",
      title: "Warranty Information",
      tagline: "30 to 90 days guaranteed protection",
      description:
        "Every repair is backed by the RepairTrust Service Warranty. If the same fault recurs during the warranty period, a certified pro will revisit and resolve it at no extra labor cost.",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      highlight: "30 to 90 Days Doorstep Guarantee",
      badge: "Protected Service",
      accentBg: "bg-emerald-50 text-emerald-700",
    },
    {
      id: "customer-support",
      title: "Customer Support",
      tagline: "Dedicated Bengaluru support desk",
      description:
        "Our local Bengaluru customer assistance team is active 7 days a week. From scheduling changes to quotation disputes, you have immediate access to real resolution managers.",
      icon: <Headphones className="w-6 h-6 text-purple-600" />,
      highlight: "Phone, WhatsApp & Dispute Ombudsman",
      badge: "Local Support",
      accentBg: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <section id="why-repairtrust" className="py-16 md:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            Built on Complete Accountability
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            Why RepairTrust?
          </h2>
          <p className="mt-3 text-slate-600 text-base max-w-2xl mx-auto">
            Traditional appliance repair is plagued by price ambiguity, unverified handymen, and vanishing warranties. We built RepairTrust to solve every point of failure.
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {pillar.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${pillar.accentBg}`}
                  >
                    {pillar.badge}
                  </span>
                </div>

                {/* Pillar Title */}
                <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs font-medium text-emerald-600 mb-3">
                  {pillar.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              {/* Bottom Feature Pill */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pillar.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
