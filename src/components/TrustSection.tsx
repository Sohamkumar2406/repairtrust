"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  UserCheck,
  Award,
  Lock,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  Cpu,
  ChevronRight,
  Shield,
  HelpCircle,
} from "lucide-react";

export function TrustSection() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const verificationProtocol = [
    {
      level: "Layer 1",
      title: "Government Identity & Background Clearance",
      description:
        "Every applicant must provide government-issued Aadhaar identity documents and submit to police background checks to verify legal identity and zero criminal record history before approval.",
      details: [
        "Aadhaar authentication with verified phone linkage",
        "Police clearance check and local residential verification in Bengaluru",
        "Zero-tolerance policy for previous misconduct or unverified identities",
      ],
      icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
    },
    {
      level: "Layer 2",
      title: "Technical Trade Assessment & Tool Inspection",
      description:
        "Technicians are not approved simply by registering. They must pass a hands-on practical diagnostic evaluation across their specific appliance domains and prove ownership of calibrated diagnostic tools.",
      details: [
        "Practical diagnostic test on modern multi-brand circuit boards & appliances",
        "Inspection of ESD-safe toolkits, digital multimeters, and safety gear",
        "Minimum 2+ years of documented trade experience required",
      ],
      icon: <Award className="w-6 h-6 text-blue-600" />,
    },
    {
      level: "Layer 3",
      title: "Standardized Price Integrity Agreement",
      description:
        "Every technician signs a legally binding adherence contract to RepairTrust's standard line-item rate cards. Unauthorized price inflation or unapproved extra charges result in immediate platform debarment.",
      details: [
        "No on-the-spot price inflation or surprise diagnosis charges",
        "Transparent component rate card linked directly to OEM market standards",
        "All quotation modifications must be digitally approved by the customer",
      ],
      icon: <Lock className="w-6 h-6 text-indigo-600" />,
    },
    {
      level: "Layer 4",
      title: "Digital Warranty & Customer Protection Escrow",
      description:
        "Each completed repair generates a tamper-proof digital repair record. The customer does not pay upfront before diagnosis, and warranties are legally backed by the RepairTrust service charter.",
      details: [
        "Zero advance payment required prior to physical fault diagnosis",
        "Replaced parts logged with specific manufacturer part numbers and serials",
        "30 to 90 days guaranteed revisit coverage if the identical fault recurs",
      ],
      icon: <FileCheck className="w-6 h-6 text-teal-600" />,
    },
  ];

  const charterPoints = [
    {
      title: "Genuine Spare Parts Pledge",
      description:
        "Technicians must use genuine OEM or certified OES spare parts. Every replacement part includes serial tracking on your digital repair record.",
    },
    {
      title: "No Advance Diagnostics Trap",
      description:
        "You never pay in advance before a technician assesses your appliance. Standard diagnostic fees are fully disclosed before the visit.",
    },
    {
      title: "Live Operational Demonstration",
      description:
        "Before requesting payment or leaving your doorstep, the technician must run a complete live test proving the machine or device is fully functioning.",
    },
    {
      title: "Bengaluru Dispute Ombudsman",
      description:
        "If you ever dispute a diagnostic quote or repair quality, our dedicated Bengaluru resolution desk steps in to mediate and protect your rights.",
    },
  ];

  return (
    <section id="trust-guarantee" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Our Verification & Customer Protection Protocol
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            How We Protect You at Every Step
          </h2>
          <p className="mt-3 text-slate-600 text-base max-w-2xl mx-auto">
            Trust is not a marketing buzzword at RepairTrust. It is a verifiable four-layer protocol that guarantees technician competence, price fairness, and doorstep accountability.
          </p>
        </div>

        {/* 4-Layer Verification Protocol - Interactive Explorer */}
        <div className="bg-[#101828] text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-16 border border-slate-800">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 block mb-2">
              The 4-Layer Verification Protocol
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Every technician is vetted before visiting your home.
            </h3>
            <p className="text-slate-300 text-sm mt-2">
              Select each verification layer below to inspect the compliance requirements every technician must satisfy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Tabs List */}
            <div className="lg:col-span-5 flex flex-col gap-2.5">
              {verificationProtocol.map((item, idx) => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-xl text-left transition-all border flex items-center justify-between ${
                    activeStep === idx
                      ? "bg-slate-800/90 border-emerald-500 shadow-md"
                      : "bg-slate-900/50 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                        activeStep === idx
                          ? "bg-emerald-500 text-slate-950 font-bold"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      0{idx + 1}
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                        {item.level}
                      </span>
                      <span className="text-sm font-semibold text-slate-100 line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      activeStep === idx ? "text-emerald-400 translate-x-1" : "text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Active Details Card */}
            <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      {verificationProtocol[activeStep].icon}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-semibold text-emerald-400">
                        {verificationProtocol[activeStep].level} Standard
                      </span>
                      <h4 className="text-lg font-bold text-white">
                        {verificationProtocol[activeStep].title}
                      </h4>
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {verificationProtocol[activeStep].description}
                </p>

                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Enforced Audit Criteria:
                  </span>
                  {verificationProtocol[activeStep].details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Compliance Level: Mandatory</span>
                <span className="text-emerald-400 font-semibold">Active in Bengaluru</span>
              </div>
            </div>
          </div>
        </div>

        {/* The RepairTrust Customer Protection Charter */}
        <div>
          <div className="max-w-2xl mb-8">
            <h3 className="text-2xl font-bold text-slate-900">
              The RepairTrust Customer Charter
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              Our written standards safeguarding customer rights for every booking made on RepairTrust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {charterPoints.map((point, index) => (
              <div
                key={index}
                className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs font-mono mb-4">
                  0{index + 1}
                </div>
                <h4 className="font-bold text-base text-slate-900 mb-2">
                  {point.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
