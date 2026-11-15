"use client";

import React, { useState } from "react";
import {
  Search,
  MapPin,
  ShieldCheck,
  Wrench,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { BENGALURU_LOCATIONS } from "@/data/bengaluruLocations";
import { POPULAR_SERVICES } from "@/data/servicesData";

interface HeroSectionProps {
  onSearch: (serviceId: string, issue: string, location: string) => void;
  onOpenTechnician: () => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
}

export function HeroSection({
  onSearch,
  onOpenTechnician,
  selectedLocation,
  onSelectLocation,
}: HeroSectionProps) {
  const [selectedServiceId, setSelectedServiceId] = useState("ac-repair");
  const [searchQuery, setSearchQuery] = useState("");
  const [validationError, setValidationError] = useState("");

  const quickPills = [
    { label: "AC Not Cooling", serviceId: "ac-repair", query: "AC not cooling effectively" },
    { label: "Washing Machine Drum", serviceId: "washing-machine-repair", query: "Drum not spinning" },
    { label: "Laptop Screen Cracked", serviceId: "laptop-repair", query: "Display replacement" },
    { label: "Fridge Not Cold", serviceId: "refrigerator-repair", query: "Compressor cooling issue" },
    { label: "Water Leakage", serviceId: "plumbing", query: "Pipe leakage repair" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validate location
    if (!selectedLocation) {
      setValidationError("Please select your Bengaluru locality");
      return;
    }

    const issueToUse = searchQuery.trim() || "Inspection & diagnostic quotation requested";
    onSearch(selectedServiceId, issueToUse, selectedLocation);
  };

  const handleQuickPill = (serviceId: string, query: string) => {
    setSelectedServiceId(serviceId);
    setSearchQuery(query);
    setValidationError("");
    onSearch(serviceId, query, selectedLocation);
  };

  return (
    <section
      id="hero"
      className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC]"
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Trust Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-medium shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-emerald-900">Bengaluru&apos;s Verified Network:</span>
            <span>Transparent Quotations & Doorstep Repairs</span>
          </div>
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#101828] tracking-tight leading-[1.12]">
            Repairs Made Simple.
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Trust Made Certain.
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Find verified repair professionals, compare transparent quotations and get your everyday repairs done with confidence.
          </p>
        </div>

        {/* Interactive Search & Quotation Widget */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-3 sm:p-4 md:p-6 transition-all">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
                {/* Service Category Dropdown */}
                <div className="md:col-span-4 bg-slate-50/90 hover:bg-slate-100/80 transition-colors border border-slate-200 rounded-xl px-3.5 py-2.5">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Repair Service
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-900 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 cursor-pointer"
                  >
                    {POPULAR_SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (from ₹{s.startingPrice})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Issue Search Input */}
                <div className="md:col-span-5 bg-slate-50/90 hover:bg-slate-100/80 transition-colors border border-slate-200 rounded-xl px-3.5 py-2.5">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Problem / Symptom
                  </label>
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. AC not cooling, drum noise, blank screen..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (validationError) setValidationError("");
                      }}
                      className="w-full text-sm font-medium text-slate-900 bg-transparent border-0 placeholder-slate-400 focus:outline-none focus:ring-0 p-0"
                    />
                  </div>
                </div>

                {/* Bengaluru Location Selector */}
                <div className="md:col-span-3 bg-slate-50/90 hover:bg-slate-100/80 transition-colors border border-slate-200 rounded-xl px-3.5 py-2.5">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Bengaluru Area
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => onSelectLocation(e.target.value)}
                      className="w-full text-sm font-semibold text-slate-900 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 cursor-pointer"
                    >
                      {BENGALURU_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Error feedback if needed */}
              {validationError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Bottom CTA Row inside widget */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
                {/* Quick suggestions pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs text-slate-500">
                  <span className="shrink-0 font-medium text-slate-400">Popular:</span>
                  {quickPills.map((pill) => (
                    <button
                      key={pill.label}
                      type="button"
                      onClick={() => handleQuickPill(pill.serviceId, pill.query)}
                      className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-medium transition-colors"
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>

                {/* Primary & Secondary Action CTAs */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    Find a Technician
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Secondary CTA row directly below widget */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="text-slate-500">Are you a skilled repair professional?</span>
            <button
              type="button"
              onClick={onOpenTechnician}
              className="inline-flex items-center gap-1.5 font-semibold text-[#101828] hover:text-emerald-600 underline underline-offset-4 decoration-emerald-500 transition-colors"
            >
              <Wrench className="w-4 h-4 text-emerald-600" />
              Become a Technician &rarr;
            </button>
          </div>
        </div>

        {/* 4 Trust Highlights Below Hero */}
        <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-200/70 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 mb-1">
              Verified Professionals
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Govt ID, Aadhaar and practical trade competency cleared.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-200/70 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 mb-1">
              Transparent Quotes
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Line-item breakdown of labor, parts and taxes before work starts.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-200/70 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 mb-1">
              30–90 Day Warranty
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Backed by our customer charter and tamper-proof digital record.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-200/70 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 mb-1">
              Rapid Doorstep Visit
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Technicians in your Bengaluru locality ready within 30–60 mins.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
