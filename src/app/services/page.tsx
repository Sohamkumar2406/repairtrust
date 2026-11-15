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
  Search,
  CheckCircle2,
  Filter,
  MapPin,
  ChevronRight,
  Award,
  BadgePercent,
  FileCheck2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/modals/BookingModal";
import { TechnicianModal } from "@/components/modals/TechnicianModal";
import { AuthModal } from "@/components/modals/AuthModal";
import { POPULAR_SERVICES, ServiceCategory } from "@/data/servicesData";
import { BENGALURU_LOCATIONS } from "@/data/bengaluruLocations";
import { formatCurrency } from "@/lib/utils";

export default function ServicesDirectoryPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>("Koramangala");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string>("ac-repair");
  const [bookingIssue, setBookingIssue] = useState<string>("");

  const [isTechnicianOpen, setIsTechnicianOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<"customer" | "technician">("customer");

  const tabs = ["All", "Appliances", "Electronics", "Home Utility"];

  const handleOpenBooking = (serviceId?: string, issue?: string) => {
    if (serviceId) setBookingServiceId(serviceId);
    if (issue) setBookingIssue(issue);
    setIsBookingOpen(true);
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Wind":
        return <Wind className="w-6 h-6 text-emerald-600" />;
      case "RotateCcw":
        return <RotateCcw className="w-6 h-6 text-blue-600" />;
      case "Laptop":
        return <Laptop className="w-6 h-6 text-indigo-600" />;
      case "Refrigerator":
        return <Refrigerator className="w-6 h-6 text-cyan-600" />;
      case "Smartphone":
        return <Smartphone className="w-6 h-6 text-violet-600" />;
      case "Zap":
        return <Zap className="w-6 h-6 text-amber-600" />;
      case "Wrench":
        return <Wrench className="w-6 h-6 text-teal-600" />;
      case "Tv":
        return <Tv className="w-6 h-6 text-rose-600" />;
      default:
        return <Wrench className="w-6 h-6 text-emerald-600" />;
    }
  };

  const getAccentBg = (iconName: string) => {
    switch (iconName) {
      case "Wind":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "RotateCcw":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Laptop":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Refrigerator":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
      case "Smartphone":
        return "bg-violet-50 text-violet-700 border-violet-100";
      case "Zap":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Wrench":
        return "bg-teal-50 text-teal-700 border-teal-100";
      case "Tv":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }
  };

  const filteredServices = POPULAR_SERVICES.filter((item) => {
    const matchesTab = activeTab === "All" || item.categoryGroup === activeTab;
    const matchesQuery =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.popularIssues.some((issue) =>
        issue.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      item.supportedBrands.some((b) =>
        b.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTab && matchesQuery;
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenTechnician={() => setIsTechnicianOpen(true)}
        onOpenAuth={(role) => {
          setAuthRole(role || "customer");
          setIsAuthOpen(true);
        }}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] pt-12 pb-16 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
              <Link href="/" className="hover:text-emerald-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800">Services Directory</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Bengaluru Doorstep Services Catalog
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#101828] tracking-tight">
                Complete Repair Services Directory
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                Browse all verified appliance, electronics, and home utility repair categories. Every service is backed by transparent quotations, certified OEM spares, and our 30–90 day guarantee.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Category tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab
                        ? "bg-[#101828] text-white shadow-sm"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {tab === "All" ? `All Services (${POPULAR_SERVICES.length})` : tab}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="w-full md:w-80 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search service, issue, or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredServices.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto">
                <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-800 text-base mb-1">
                  No services matching &quot;{searchQuery}&quot;
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Try searching for keywords like &quot;cooling&quot;, &quot;screen&quot;, &quot;leak&quot;, or reset filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("All");
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="h-1.5 w-full bg-gradient-to-r from-slate-200 to-slate-200 group-hover:from-emerald-500 group-hover:to-teal-500 transition-all" />

                    <div className="p-6 sm:p-7">
                      {/* Top Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getAccentBg(
                            service.iconName
                          )} shadow-xs group-hover:scale-105 transition-transform`}
                        >
                          {getServiceIcon(service.iconName)}
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-semibold text-slate-500 block">
                            Starting Diagnostic / Labor
                          </span>
                          <span className="text-base font-bold text-slate-900">
                            {formatCurrency(service.startingPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Clickable Title Linking to Detail Page */}
                      <Link
                        href={`/services/${service.slug}`}
                        className="block group-hover:text-emerald-700 transition-colors"
                      >
                        <h2 className="font-bold text-xl text-slate-900 mb-2">
                          {service.name}
                        </h2>
                      </Link>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                        {service.shortDesc}
                      </p>

                      {/* Common Problems Checklist */}
                      <div className="mb-5 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                          Common Problems Solved:
                        </span>
                        {service.popularIssues.slice(0, 3).map((issue) => (
                          <div
                            key={issue}
                            className="flex items-center gap-2 text-xs text-slate-700"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{issue}</span>
                          </div>
                        ))}
                      </div>

                      {/* Badges */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-emerald-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {service.warrantyDays}-day warranty
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          {service.avgResponseTime}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 bg-slate-50/80 border-t border-slate-100 grid grid-cols-2 gap-2 mt-auto">
                      <Link
                        href={`/services/${service.slug}`}
                        className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 text-center"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </Link>

                      <button
                        onClick={() => handleOpenBooking(service.id)}
                        className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>Book Service</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Transparent Pricing Standards Section */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 block mb-2">
                Standardized Rate Architecture
              </span>
              <h2 className="text-3xl font-extrabold text-[#101828]">
                How RepairTrust Transparent Pricing Works
              </h2>
              <p className="mt-3 text-slate-600 text-sm">
                We eliminate guesswork. Every doorstep visit follows a standardized line-item rate card with zero surprise add-ons.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <BadgePercent className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">
                  1. Doorstep Diagnosis Fee
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A nominal inspection fee (₹149 - ₹199) covers travel and comprehensive multimeter/diagnostic testing. If you proceed with the recommended repair, this fee is fully adjusted into your total bill!
                </p>
              </div>

              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">
                  2. Line-Item Spare Parts
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Replacement components (capacitors, pumps, screens, valves) are billed strictly at actual OEM retail prices. Every part includes manufacturer part serial numbers logged in your digital receipt.
                </p>
              </div>

              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">
                  3. 30–90 Day Service Warranty
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every completed repair comes with a guaranteed warranty. If the identical breakdown recurs during the validity period, a certified technician will revisit and resolve it at ₹0 additional labor.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        onOpenBooking={handleOpenBooking}
        onOpenTechnician={() => setIsTechnicianOpen(true)}
        onSelectLocation={setSelectedLocation}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setBookingIssue("");
        }}
        preselectedServiceId={bookingServiceId}
        prefilledIssue={bookingIssue}
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
