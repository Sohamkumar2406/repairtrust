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
  CheckCircle,
} from "lucide-react";
import { POPULAR_SERVICES, ServiceCategory } from "@/data/servicesData";
import { formatCurrency } from "@/lib/utils";

interface ServiceCategoriesProps {
  onSelectService: (serviceId: string, issue?: string) => void;
}

export function ServiceCategories({ onSelectService }: ServiceCategoriesProps) {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [filterQuery, setFilterQuery] = useState<string>("");

  const tabs = ["All", "Appliances", "Electronics", "Home Utility"];

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
      filterQuery.trim() === "" ||
      item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.popularIssues.some((issue) =>
        issue.toLowerCase().includes(filterQuery.toLowerCase())
      );
    return matchesTab && matchesQuery;
  });

  return (
    <section id="services" className="py-16 md:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Transparent Pricing & Verified Specialists
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
              Popular Repair Categories
            </h2>
            <p className="mt-2 text-slate-600 text-base max-w-2xl">
              Choose your appliance or device. Every booking includes upfront diagnostic quotations, certified OEM spares, and our guarantee.
            </p>
          </div>

          {/* Search bar & View Directory link */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-64 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search category or issue..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
              />
            </div>
            <Link
              href="/services"
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 shrink-0 shadow-2xs"
            >
              <span>All Services</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            </Link>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
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
              {tab === "All" ? "All Services (8)" : tab}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto">
            <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-800 text-base mb-1">
              No service matching &quot;{filterQuery}&quot;
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Try searching for &quot;cooling&quot;, &quot;screen&quot;, &quot;leak&quot; or reset filters.
            </p>
            <button
              onClick={() => {
                setFilterQuery("");
                setActiveTab("All");
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Top Bar Accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 group-hover:from-emerald-500 group-hover:via-teal-500 group-hover:to-emerald-400 transition-all" />

                <div className="p-6">
                  {/* Category Header */}
                  <div className="flex items-start justify-between mb-4">
                    <Link
                      href={`/services/${service.slug}`}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getAccentBg(
                        service.iconName
                      )} shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      {getServiceIcon(service.iconName)}
                    </Link>

                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-slate-600 block">
                        Diagnostics & Labor from
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        {formatCurrency(service.startingPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Clickable Title */}
                  <Link
                    href={`/services/${service.slug}`}
                    className="block group/title"
                  >
                    <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover/title:text-emerald-600 transition-colors flex items-center justify-between">
                      <span>{service.name}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover/title:opacity-100 -translate-x-1 group-hover/title:translate-x-0 transition-all text-emerald-600" />
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {service.shortDesc}
                  </p>

                  {/* Common issues pills */}
                  <div className="mb-4">
                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Common Fixes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {service.popularIssues.slice(0, 3).map((issue) => (
                        <button
                          key={issue}
                          type="button"
                          onClick={() => onSelectService(service.id, issue)}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-100 transition-colors text-left"
                        >
                          {issue}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Badges / Trust Info */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500 mb-5">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{service.warrantyDays}-day warranty</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{service.avgResponseTime}</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA: View Details & Book Service */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 mt-auto grid grid-cols-2 gap-2">
                  <Link
                    href={`/services/${service.slug}`}
                    className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 text-center"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>

                  <button
                    onClick={() => onSelectService(service.id)}
                    className="py-2.5 px-3 bg-[#101828] hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
