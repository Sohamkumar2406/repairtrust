"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Wrench,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Send,
  Star,
  DollarSign,
  Briefcase,
  FileCheck2,
  UserCheck,
  TrendingUp,
  X,
  Wind,
  RotateCcw,
  Laptop,
  Refrigerator,
  Smartphone,
  Zap,
  Tv,
  Phone,
  Navigation,
  CheckCircle,
  Award,
  MessageSquare,
  Key,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/modals/BookingModal";
import { TechnicianModal } from "@/components/modals/TechnicianModal";
import { AuthModal } from "@/components/modals/AuthModal";
import { ChatModal } from "@/components/modals/ChatModal";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";

interface LeadItem {
  id: string;
  title: string;
  description: string;
  problem_details: any;
  preferred_date: string;
  preferred_time: string;
  request_status: string;
  created_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
  address?: {
    id: string;
    address_line: string;
    area: string;
    pincode: string;
  };
  quotes?: Array<{
    id: string;
    total_amount: number;
    quote_status: string;
    technician_id: string;
  }>;
}

interface TechnicianBooking {
  id: string;
  booking_status: string;
  scheduled_at: string;
  final_amount: number;
  created_at: string;
  request?: {
    title: string;
    description: string;
    category?: { name: string; slug: string };
    address?: { address_line: string; area: string; pincode: string };
  };
  customer?: {
    full_name: string;
    phone: string;
    avatar_url?: string;
  };
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "ac-repair": Wind,
  "washing-machine-repair": RotateCcw,
  "laptop-repair": Laptop,
  "refrigerator-repair": Refrigerator,
  "mobile-repair": Smartphone,
  electrical: Zap,
  plumbing: Wrench,
  "tv-repair": Tv,
};

export default function TechnicianPortalPage() {
  const { user, profile, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"leads" | "jobs">("leads");
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [jobs, setJobs] = useState<TechnicianBooking[]>([]);
  const [currentTechId, setCurrentTechId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isActivatingTech, setIsActivatingTech] = useState<boolean>(false);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);

  // Quote modal state
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [labourCost, setLabourCost] = useState<string>("349");
  const [partsCost, setPartsCost] = useState<string>("0");
  const [inspectionCost, setInspectionCost] = useState<string>("0");
  const [estimatedTime, setEstimatedTime] = useState<string>("45 - 60 mins");
  const [quoteTerms, setQuoteTerms] = useState<string>("Includes 60-day RepairTrust service warranty.");
  const [isSubmittingQuote, setIsSubmittingQuote] = useState<boolean>(false);
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);
  const [quoteError, setQuoteError] = useState<string>("");

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTechnicianOpen, setIsTechnicianOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<"customer" | "technician">("technician");
  const [selectedLocation, setSelectedLocation] = useState<string>("Koramangala");
  const [chatJob, setChatJob] = useState<TechnicianBooking | null>(null);

  const fetchLeadsAndJobs = useCallback(async () => {
    try {
      setError("");
      const [leadsRes, jobsRes] = await Promise.all([
        fetch("/api/technician/leads"),
        fetch("/api/bookings?role=technician"),
      ]);

      const leadsData = await leadsRes.json();
      if (leadsRes.ok && leadsData.success) {
        setLeads(leadsData.data || []);
        if (leadsData.currentTechId) setCurrentTechId(leadsData.currentTechId);
      }

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        if (jobsData.success) {
          setJobs(jobsData.data || []);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to server");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeadsAndJobs();
  }, [fetchLeadsAndJobs]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLeadsAndJobs();
  };

  const handleActivateTechnician = async () => {
    setIsActivatingTech(true);
    try {
      const res = await fetch("/api/technician/activate", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchLeadsAndJobs();
      } else {
        setError(data.error || "Failed to activate technician profile");
      }
    } catch (err: any) {
      setError(err.message || "Failed to activate technician profile");
    } finally {
      setIsActivatingTech(false);
    }
  };

  const handleOpenQuoteModal = (lead: LeadItem) => {
    setSelectedLead(lead);
    setLabourCost("349");
    setPartsCost("0");
    setInspectionCost("0");
    setEstimatedTime("45 - 60 mins");
    setQuoteTerms("Includes 60-day RepairTrust service warranty.");
    setQuoteError("");
    setQuoteSuccess(false);
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    if (!isAuthenticated) {
      setQuoteError("Please sign in as a technician to submit quotations.");
      return;
    }

    const labour = parseFloat(labourCost) || 0;
    const parts = parseFloat(partsCost) || 0;
    const inspection = parseFloat(inspectionCost) || 0;
    const total = labour + parts + inspection;

    if (total < 50) {
      setQuoteError("Total quote must be at least ₹50");
      return;
    }

    setIsSubmittingQuote(true);
    setQuoteError("");

    try {
      const today = new Date();
      const validityDate = new Date(today.setDate(today.getDate() + 7))
        .toISOString()
        .split("T")[0];

      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: selectedLead.id,
          labourCost: labour,
          partsCost: parts,
          inspectionCost: inspection,
          totalAmount: total,
          estimatedCompletionTime: estimatedTime,
          validityDate,
          terms: quoteTerms,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setQuoteSuccess(true);
        setTimeout(() => {
          setSelectedLead(null);
          fetchLeadsAndJobs();
        }, 1500);
      } else {
        setQuoteError(result.error || "Failed to submit quote. Please try again.");
      }
    } catch (err: any) {
      setQuoteError(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const handleUpdateJobStatus = async (bookingId: string, nextStatus: string) => {
    setUpdatingBookingId(bookingId);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          newStatus: nextStatus,
          notes: `Status updated to ${nextStatus} by technician`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchLeadsAndJobs();
      } else {
        alert(data.error || "Failed to update job status");
      }
    } catch (err: any) {
      alert(err.message || "Failed to connect to server");
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const totalCalculated =
    (parseFloat(labourCost) || 0) +
    (parseFloat(partsCost) || 0) +
    (parseFloat(inspectionCost) || 0);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* 1. Header Navigation */}
      <Navbar
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenTechnician={() => setIsTechnicianOpen(true)}
        onOpenAuth={(role = "technician") => {
          setAuthRole(role);
          setIsAuthOpen(true);
        }}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      {/* 2. Main Portal Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#101828] text-emerald-400 flex items-center justify-center shadow-sm">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Technician Partner Portal
                </h1>
                <span className="text-xs text-slate-500">
                  Bengaluru Hub • Verified Repair Professional Network
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Availability Switch */}
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                isAvailable
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-slate-100 text-slate-600 border-slate-300"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span>{isAvailable ? "Online & Accepting Jobs" : "Offline / On Job"}</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-sm disabled:opacity-50"
              title="Refresh leads"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Open Customer Leads
            </span>
            <span className="text-2xl font-bold text-emerald-600">{leads.length}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Across Bengaluru</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Active Doorstep Jobs
            </span>
            <span className="text-2xl font-bold text-amber-600">{jobs.length}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Confirmed by customers</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Direct Payout Rate
            </span>
            <span className="text-2xl font-bold text-blue-600">85% - 90%</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Weekly UPI settlement</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Partner Rating
            </span>
            <div className="flex items-center gap-1 text-2xl font-bold text-slate-900">
              <span>4.9</span>
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
              ✓ Background Verified
            </span>
          </div>
        </div>

        {/* Not Signed In Banner */}
        {!isAuthenticated && (
          <div className="p-4 mb-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>You are currently browsing leads in preview mode.</strong> Sign in with your Technician Partner account to submit live quotes and accept doorstep repair bookings.
              </span>
            </div>
            <button
              onClick={() => {
                setAuthRole("technician");
                setIsAuthOpen(true);
              }}
              className="px-4 py-2 bg-amber-800 text-white font-semibold rounded-xl hover:bg-amber-900 whitespace-nowrap"
            >
              Sign In as Technician
            </button>
          </div>
        )}

        {/* Authenticated but Not Yet Enrolled as Technician */}
        {isAuthenticated && !currentTechId && (
          <div className="p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Activate Technician Access:</strong> You are logged in as <strong>{profile?.full_name || user?.email}</strong>. Activate your verified technician credentials to view leads and submit transparent repair quotes across Bengaluru.
              </span>
            </div>
            <button
              onClick={handleActivateTechnician}
              disabled={isActivatingTech}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-1.5 transition-colors"
            >
              {isActivatingTech ? "Activating..." : "Activate Verified Partner"}
            </button>
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("leads")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "leads"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Live Customer Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "jobs"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Navigation className="w-4 h-4" />
            My Active Jobs & Tracking ({jobs.length})
          </button>
        </div>

        {/* TAB 1: Live Leads Feed */}
        {activeTab === "leads" && (
          <div>
            {isLoading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-600">Loading open customer leads...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={handleRefresh}
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold rounded-lg"
                >
                  Retry
                </button>
              </div>
            ) : leads.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No open leads right now</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-4">
                  All active repair requests have been assigned. Check back shortly as new customer requests come in across Bengaluru!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => {
                  const Icon = CATEGORY_ICONS[lead.category?.slug || ""] || Wrench;
                  const bookingRef = `RT-BLR-${lead.id.slice(0, 8).toUpperCase()}`;
                  const quotesCount = lead.quotes?.length || 0;
                  const hasQuoted = lead.quotes?.some((q) => q.technician_id === currentTechId);

                  return (
                    <div
                      key={lead.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 sm:p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base text-slate-900">
                                {lead.category?.name || "Repair Request"}
                              </span>
                              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                {bookingRef}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">
                              Posted on {new Date(lead.created_at).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}, {new Date(lead.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {quotesCount} {quotesCount === 1 ? "Quote" : "Quotes"} Submitted
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="md:col-span-2 space-y-1.5">
                          <span className="font-semibold text-slate-700 uppercase tracking-wider block text-[11px]">
                            Customer Problem Summary
                          </span>
                          <p className="text-sm font-bold text-slate-900 leading-snug">
                            {lead.title}
                          </p>
                          <p className="text-slate-600 text-xs">
                            {lead.description}
                          </p>
                        </div>

                        <div className="space-y-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <div className="flex items-center gap-2 text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-medium truncate">
                              {lead.address?.area || lead.problem_details?.locality || "Bengaluru"}
                              {lead.address?.pincode ? ` (${lead.address.pincode})` : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="capitalize">{lead.preferred_time || "Urgent (Within 2 Hours)"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer & Action */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs text-slate-500">
                          Standard Doorstep Inspection: <strong>₹199</strong> (Waived if repair approved)
                        </div>

                        {hasQuoted ? (
                          <span className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-semibold text-xs flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            You Already Sent a Quote
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenQuoteModal(lead)}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Send Upfront Quote
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: My Active Jobs & Tracking */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Navigation className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No active jobs assigned yet</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-4">
                  Send quotes to open leads! When a customer accepts your quotation, the booking will appear here with customer contact and address details.
                </p>
                <button
                  onClick={() => setActiveTab("leads")}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-sm"
                >
                  View Open Leads
                </button>
              </div>
            ) : (
              jobs.map((job) => {
                const bookingRef = `RT-JOB-${job.id.slice(0, 8).toUpperCase()}`;
                const status = job.booking_status;

                let nextStatus = "";
                let nextLabel = "";
                let stepNumber = 1;

                if (status === "confirmed") {
                  nextStatus = "technician_en_route";
                  nextLabel = "Start Journey / En Route 🚗";
                  stepNumber = 1;
                } else if (status === "technician_en_route") {
                  nextStatus = "arrived";
                  nextLabel = "Mark Arrived at Doorstep 🚪";
                  stepNumber = 2;
                } else if (status === "arrived") {
                  nextStatus = "in_progress";
                  nextLabel = "Start Repair Work 🔧";
                  stepNumber = 3;
                } else if (status === "in_progress") {
                  nextStatus = "completed";
                  nextLabel = "Complete Job & Issue Digital Warranty ✅";
                  stepNumber = 4;
                } else if (status === "completed") {
                  stepNumber = 5;
                }

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-slate-900">
                            {job.request?.category?.name || "Appliance Repair"}
                          </span>
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {bookingRef}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          Scheduled: {new Date(job.scheduled_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Agreed Amount</span>
                        <span className="text-lg font-bold text-emerald-700">
                          {formatCurrency(job.final_amount)}
                        </span>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">
                          Customer Contact
                        </span>
                        <p className="font-bold text-sm text-slate-900">
                          {job.customer?.full_name || "Customer"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setChatJob(job)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            Chat with Customer
                          </button>
                          {job.customer?.phone && (
                            <a
                              href={`tel:${job.customer?.phone}`}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              Call
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">
                          Doorstep Service Location
                        </span>
                        <p className="text-slate-800 font-medium">
                          {job.request?.address?.address_line || "Customer Address"}
                        </p>
                        <p className="text-slate-500">
                          {job.request?.address?.area} ({job.request?.address?.pincode})
                        </p>
                      </div>
                    </div>

                    {/* Progress Stepper Visualizer */}
                    <div className="my-3 py-3 border-t border-b border-slate-100">
                      <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-semibold">
                        <div className={stepNumber >= 1 ? "text-emerald-700" : "text-slate-400"}>
                          1. Confirmed
                        </div>
                        <div className={stepNumber >= 2 ? "text-emerald-700" : "text-slate-400"}>
                          2. En Route
                        </div>
                        <div className={stepNumber >= 3 ? "text-emerald-700" : "text-slate-400"}>
                          3. Arrived
                        </div>
                        <div className={stepNumber >= 4 ? "text-emerald-700" : "text-slate-400"}>
                          4. In Progress
                        </div>
                        <div className={stepNumber >= 5 ? "text-emerald-700" : "text-slate-400"}>
                          5. Completed
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full transition-all duration-300"
                          style={{ width: `${(stepNumber / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* OTP Security Verification at Doorstep */}
                    {status === "arrived" && (
                      <div className="my-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-amber-900">
                          <Key className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Ask customer for their 4-digit Doorstep Safety Code to begin repair:</span>
                        </div>
                        <span className="font-mono font-bold text-amber-800 bg-white px-2.5 py-1 rounded-lg border border-amber-300">
                          OTP: {Math.abs(job.id.split("").reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) % 9000, 7)) + 1000}
                        </span>
                      </div>
                    )}

                    {/* Action Step Button */}
                    <div className="pt-2 flex justify-end">
                      {status !== "completed" ? (
                        <button
                          onClick={() => handleUpdateJobStatus(job.id, nextStatus)}
                          disabled={updatingBookingId === job.id}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60"
                        >
                          {updatingBookingId === job.id ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Updating...
                            </>
                          ) : (
                            nextLabel
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
                          <Award className="w-4 h-4 text-emerald-600" />
                          Job Completed • 60-Day Warranty Active
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* Quote Submission Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm"
            onClick={() => setSelectedLead(null)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#101828] text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-white">Send Transparent Quote</h3>
                  <p className="text-[11px] text-slate-400 truncate max-w-xs">{selectedLead.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quoteSuccess ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-1">Quote Submitted!</h4>
                <p className="text-xs text-slate-600 mb-5">
                  Your quotation has been sent directly to the customer. When they accept, it will appear in your Active Jobs!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="p-6 space-y-4">
                {quoteError && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{quoteError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Labour Charges (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={labourCost}
                      onChange={(e) => setLabourCost(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estimated Parts Cost (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={partsCost}
                      onChange={(e) => setPartsCost(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Doorstep Inspection Fee (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={inspectionCost}
                      onChange={(e) => setInspectionCost(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">₹0 if waived</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                      placeholder="e.g. 45 - 60 mins"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Warranty & Terms
                  </label>
                  <textarea
                    rows={2}
                    value={quoteTerms}
                    onChange={(e) => setQuoteTerms(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Total Quote Calculation Box */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    Total Customer Estimate:
                  </span>
                  <span className="text-xl font-extrabold text-emerald-700">
                    {formatCurrency(totalCalculated)}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingQuote}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-70"
                  >
                    {isSubmittingQuote ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Send Quote to Customer
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. Footer */}
      <Footer
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenTechnician={() => setIsTechnicianOpen(true)}
        onSelectLocation={setSelectedLocation}
      />

      {/* 4. Global Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
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

      {chatJob && (
        <ChatModal
          isOpen={!!chatJob}
          onClose={() => setChatJob(null)}
          bookingId={chatJob.id}
          recipientName={chatJob.customer?.full_name || "Customer"}
          recipientRole="Customer"
          recipientPhone={chatJob.customer?.phone}
          serviceTitle={chatJob.request?.title || "Doorstep Job"}
        />
      )}
    </div>
  );
}
