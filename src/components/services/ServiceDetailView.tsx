"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wind,
  RotateCcw,
  Laptop,
  Refrigerator,
  Smartphone,
  Zap,
  Wrench,
  Tv,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Award,
  BadgePercent,
  FileCheck2,
  Lock,
  PhoneCall,
  AlertCircle,
  HelpCircle,
  Building2,
  UserCheck,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/modals/BookingModal";
import { TechnicianModal } from "@/components/modals/TechnicianModal";
import { AuthModal } from "@/components/modals/AuthModal";
import { ServiceCategory } from "@/data/servicesData";
import { formatCurrency } from "@/lib/utils";

interface ServiceDetailViewProps {
  service: ServiceCategory;
}

export function ServiceDetailView({ service }: ServiceDetailViewProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>("Koramangala");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [prefilledIssue, setPrefilledIssue] = useState<string>("");

  const [isTechnicianOpen, setIsTechnicianOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<"customer" | "technician">("customer");

  const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({
    0: true,
    1: true,
  });

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleBookWithIssue = (issue: string) => {
    setPrefilledIssue(issue);
    setIsBookingOpen(true);
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Wind":
        return <Wind className="w-8 h-8 text-emerald-500" />;
      case "RotateCcw":
        return <RotateCcw className="w-8 h-8 text-blue-500" />;
      case "Laptop":
        return <Laptop className="w-8 h-8 text-indigo-500" />;
      case "Refrigerator":
        return <Refrigerator className="w-8 h-8 text-cyan-500" />;
      case "Smartphone":
        return <Smartphone className="w-8 h-8 text-violet-500" />;
      case "Zap":
        return <Zap className="w-8 h-8 text-amber-500" />;
      case "Wrench":
        return <Wrench className="w-8 h-8 text-teal-500" />;
      case "Tv":
        return <Tv className="w-8 h-8 text-rose-500" />;
      default:
        return <Wrench className="w-8 h-8 text-emerald-500" />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Navbar
        onOpenBooking={() => {
          setPrefilledIssue("");
          setIsBookingOpen(true);
        }}
        onOpenTechnician={() => setIsTechnicianOpen(true)}
        onOpenAuth={(role) => {
          setAuthRole(role || "customer");
          setIsAuthOpen(true);
        }}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      <main className="flex-1">
        {/* 1. PREMIUM SERVICE HERO SECTION */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] pt-10 pb-16 border-b border-slate-200/80 relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
              <Link href="/" className="hover:text-emerald-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/services" className="hover:text-emerald-600 transition-colors">
                Services
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">{service.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Hero Content */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Verified Doorstep Technicians Active in {selectedLocation}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101828] tracking-tight leading-tight">
                  {service.heroHeadline}
                </h1>

                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                  {service.heroSubtitle}
                </p>

                {/* Key Metrics Row */}
                <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
                  <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Diagnosis Fee
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {formatCurrency(service.diagnosticFee)}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-medium">
                      Adjusted in repair
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Warranty
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {service.warrantyDays} Days
                    </span>
                    <span className="block text-[10px] text-slate-500 font-medium">
                      Digital Certificate
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Arrival Speed
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {service.avgResponseTime}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-medium">
                      In {selectedLocation}
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => {
                      setPrefilledIssue("");
                      setIsBookingOpen(true);
                    }}
                    className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Book a Repair Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="#problems"
                    className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    View Common Problems &rarr;
                  </a>
                </div>
              </div>

              {/* Right Column: Visual Trust Card */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                        {service.categoryGroup}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {service.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        Standard Starting Labor: {formatCurrency(service.startingPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pb-6 border-b border-slate-100">
                    {service.serviceFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-5 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Need immediate help?</span>
                    <a
                      href="tel:08048209800"
                      className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      080-4820-9800
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SERVICE DESCRIPTION & SUPPORTED BRANDS */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7">
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 block mb-2">
                  Service Scope & Standards
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828] mb-4">
                  About {service.name} with RepairTrust
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                  {service.longDesc}
                </p>

                <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/90 space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    RepairTrust Quality Standards
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                    <li>Strict adherence to manufacturer torque & safety specifications.</li>
                    <li>Only certified OEM or authorized OES spare parts installed.</li>
                    <li>No surprise add-ons: Any additional parts require your digital approval.</li>
                    <li>Full post-repair clean up of work area and packaging disposal.</li>
                  </ul>
                </div>
              </div>

              {/* Supported Brands Grid */}
              <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Major Brands Covered in Bengaluru
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Multi-Brand Certified Technicians
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.supportedBrands.map((brand) => (
                    <span
                      key={brand}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                  Have an unlisted or imported model? Our verified specialists carry universal schematics and diagnostic testing gear.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. COMMON PROBLEMS COVERED */}
        <section id="problems" className="py-16 md:py-24 bg-[#F8FAFC] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 block mb-2">
                Diagnostics & Solutions
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
                Common {service.name} Problems Covered
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base">
                Click any issue below to pre-fill your repair request and receive transparent quotations from verified technicians.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.commonProblems.map((prob, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-bold text-lg text-slate-900">
                        {prob.title}
                      </h3>
                      <span className="shrink-0 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {prob.typicalDuration}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs mb-6">
                      <div className="bg-red-50/60 p-2.5 rounded-lg border border-red-100 text-slate-700">
                        <strong className="text-red-900">Symptoms:</strong> {prob.symptoms}
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
                        <strong className="text-slate-900">Likely Cause:</strong> {prob.likelyCause}
                      </div>

                      <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 text-slate-700">
                        <strong className="text-emerald-900">Repair Solution:</strong> {prob.solution}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookWithIssue(prob.title)}
                    className="w-full py-2.5 bg-slate-50 hover:bg-emerald-600 text-slate-800 hover:text-white border border-slate-200 hover:border-emerald-600 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                  >
                    <span>Request Fix for &quot;{prob.title}&quot;</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. REPAIR PROCESS */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 block mb-2">
                Standardized Methodology
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
                Our 5-Step {service.name} Process
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base">
                How our verified technicians execute repairs with complete accountability from start to finish.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {service.repairProcess.map((step) => (
                <div
                  key={step.step}
                  className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-2xl font-black text-slate-300 block mb-3">
                      {step.step}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{step.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BENEFITS OF BOOKING THROUGH REPAIRTRUST */}
        <section className="py-16 md:py-24 bg-[#F8FAFC] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 block mb-2">
                The RepairTrust Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
                Why Book Your {service.name} Through RepairTrust?
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base">
                We replace street-corner uncertainty with guaranteed standards, background-checked pros, and digital records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.serviceBenefits.map((b, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mb-2">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700">
                    Guaranteed Standard
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. SERVICE FAQ */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 block mb-2">
                Got Questions?
              </span>
              <h2 className="text-3xl font-extrabold text-[#101828]">
                {service.name} FAQ
              </h2>
              <p className="mt-2 text-slate-600 text-sm">
                Clear answers regarding bookings, parts warranties, pricing, and technician qualifications.
              </p>
            </div>

            <div className="space-y-3">
              {service.faqs.map((faq, index) => {
                const isOpen = !!openFaqs[index];
                return (
                  <div
                    key={index}
                    className="bg-[#F8FAFC] rounded-2xl border border-slate-200 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-100/50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-sm sm:text-base text-slate-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? "rotate-180 text-emerald-600" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. BOOK A REPAIR CTA BANNER */}
        <section className="py-16 bg-[#101828] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Serving all 16+ core Bengaluru zones
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Get Your {service.name} Solved?
            </h2>

            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Book in 60 seconds. Receive transparent line-item quotations from verified technicians nearby. Zero advance payment required before diagnosis.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setPrefilledIssue("");
                  setIsBookingOpen(true);
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book {service.name} Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:08048209800"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                Call Helpline: 080-4820-9800
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {service.warrantyDays}-Day Warranty Included
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Background-Checked Technicians
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                Pay After Satisfaction
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer
        onOpenBooking={(id) => {
          setPrefilledIssue("");
          setIsBookingOpen(true);
        }}
        onOpenTechnician={() => setIsTechnicianOpen(true)}
        onSelectLocation={setSelectedLocation}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setPrefilledIssue("");
        }}
        preselectedServiceId={service.id}
        prefilledIssue={prefilledIssue}
        preselectedLocation={selectedLocation}
      />

      <TechnicianModal
        isOpen={isTechnicianOpen}
        onClose={() => setIsTechnicianOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultRole={authRole}
      />
    </div>
  );
}
