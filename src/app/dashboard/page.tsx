"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  RefreshCw,
  Wind,
  RotateCcw,
  Laptop,
  Refrigerator,
  Smartphone,
  Zap,
  Wrench,
  Tv,
  Star,
  CheckCircle,
  FileText,
  User,
  Phone,
  Award,
  Navigation,
  Sparkles,
  MessageSquare,
  Receipt,
  QrCode,
  Key,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/modals/BookingModal";
import { TechnicianModal } from "@/components/modals/TechnicianModal";
import { AuthModal } from "@/components/modals/AuthModal";
import { PaymentModal } from "@/components/modals/PaymentModal";
import { InvoiceModal } from "@/components/modals/InvoiceModal";
import { ChatModal } from "@/components/modals/ChatModal";
import { WarrantyClaimModal } from "@/components/modals/WarrantyClaimModal";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";

interface ServiceRequestItem {
  id: string;
  customer_id: string;
  category_id: string;
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
    labour_cost: number;
    parts_cost: number;
    inspection_cost: number;
    total_amount: number;
    estimated_completion_time: string;
    quote_status: string;
    terms?: string;
    technician?: {
      id: string;
      business_name: string;
      average_rating: number;
      total_jobs: number;
      user?: {
        full_name: string;
        avatar_url?: string;
      };
    };
  }>;
}

interface BookingItem {
  id: string;
  booking_status: string;
  scheduled_at: string;
  final_amount: number;
  created_at: string;
  request?: {
    title: string;
    description: string;
    category?: { name: string; slug: string; icon: string };
  };
  technician?: {
    id: string;
    business_name: string;
    average_rating: number;
    profile?: { full_name: string; phone: string; avatar_url?: string };
  };
  warranty?: {
    warranty_period_days: number;
    warranty_end_date: string;
    warranty_status: string;
  };
  review?: {
    id: string;
    rating: number;
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

export default function CustomerDashboardPage() {
  const { user, profile, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [requests, setRequests] = useState<ServiceRequestItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"requests" | "bookings" | "warranties">("requests");
  const [acceptingQuoteId, setAcceptingQuoteId] = useState<string | null>(null);

  // Review state
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTechnicianOpen, setIsTechnicianOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<"customer" | "technician">("customer");
  const [selectedLocation, setSelectedLocation] = useState<string>("Koramangala");

  // Payment, Invoice & Chat Modals
  const [paymentBooking, setPaymentBooking] = useState<BookingItem | null>(null);
  const [invoiceBooking, setInvoiceBooking] = useState<BookingItem | null>(null);
  const [chatBooking, setChatBooking] = useState<BookingItem | null>(null);
  const [claimBooking, setClaimBooking] = useState<BookingItem | null>(null);
  const [paidBookingIds, setPaidBookingIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setError("");
      const [reqRes, bookRes] = await Promise.all([
        fetch("/api/requests"),
        fetch("/api/bookings"),
      ]);

      const reqData = await reqRes.json();
      if (reqRes.ok && reqData.success) {
        setRequests(reqData.data || []);
      }

      if (bookRes.ok) {
        const bookData = await bookRes.json();
        if (bookData.success) {
          setBookings(bookData.data || []);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to server");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const handleAcceptQuote = async (quoteId: string) => {
    setAcceptingQuoteId(quoteId);
    try {
      const scheduledAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, scheduledAt }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchData();
        setActiveTab("bookings");
      } else {
        alert(data.error || "Failed to accept quote. Please try again.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to connect to server");
    } finally {
      setAcceptingQuoteId(null);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBookingId) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: reviewBookingId,
          rating: reviewRating,
          reviewText,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReviewBookingId(null);
        setReviewText("");
        await fetchData();
      } else {
        alert(data.error || "Failed to submit review");
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Broadcasting to Technicians
          </span>
        );
      case "quoted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Quotes Received
          </span>
        );
      case "confirmed":
      case "booked":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Booking Confirmed • Assigned
          </span>
        );
      case "technician_en_route":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Navigation className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            Technician En Route
          </span>
        );
      case "arrived":
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Wrench className="w-3.5 h-3.5 text-emerald-600" />
            Repair in Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
            Service Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
            {status}
          </span>
        );
    }
  };

  const activeWarranties = bookings.filter((b) => b.booking_status === "completed");

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* 1. Header Navigation */}
      <Navbar
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenTechnician={() => setIsTechnicianOpen(true)}
        onOpenAuth={(role = "customer") => {
          setAuthRole(role);
          setIsAuthOpen(true);
        }}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      {/* 2. Main Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Not Logged In State */}
        {!isAuthLoading && !isAuthenticated ? (
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm mt-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Sign In to Track Repairs
            </h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Log in with your RepairTrust account to view active repair requests, compare technician quotes, and access warranty certificates.
            </p>
            <button
              onClick={() => {
                setAuthRole("customer");
                setIsAuthOpen(true);
              }}
              className="w-full py-3 bg-[#101828] hover:bg-[#1E293B] text-white font-medium text-sm rounded-xl shadow-sm transition-all"
            >
              Sign In to Your Account
            </button>
          </div>
        ) : (
          <>
            {/* Dashboard Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Welcome, {profile?.full_name || user?.email?.split("@")[0] || "Customer"}!
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Verified Customer
                  </span>
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  Track your doorstep repair requests, review transparent quotes, and view warranties in Bengaluru.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-sm disabled:opacity-50"
                  title="Refresh requests"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Book New Repair
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Active Requests
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  {requests.filter((r) => r.request_status === "open" || r.request_status === "quoted").length}
                </span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Confirmed Bookings
                </span>
                <span className="text-2xl font-bold text-purple-600">{bookings.length}</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Quotes Received
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {requests.reduce((acc, curr) => acc + (curr.quotes?.length || 0), 0)}
                </span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Active Warranties
                </span>
                <span className="text-2xl font-bold text-slate-900">{activeWarranties.length} Active</span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-3 border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab("requests")}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "requests"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileText className="w-4 h-4" />
                Active Requests & Quotes ({requests.length})
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "bookings"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Navigation className="w-4 h-4" />
                Confirmed Bookings & Tracking ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab("warranties")}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "warranties"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Award className="w-4 h-4" />
                Digital Warranties ({activeWarranties.length})
              </button>
            </div>

            {/* TAB 1: Requests & Quotes */}
            {activeTab === "requests" && (
              <div>
                {isLoading ? (
                  <div className="py-20 text-center">
                    <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-600">Loading your live requests from Supabase...</p>
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
                ) : requests.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No repair requests found</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto mb-5">
                      You haven&apos;t created any requests yet. Need an appliance or electronic repaired in Bengaluru?
                    </p>
                    <button
                      onClick={() => setIsBookingOpen(true)}
                      className="px-5 py-2.5 bg-[#101828] hover:bg-[#1E293B] text-white font-medium text-sm rounded-xl transition-all inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-emerald-400" />
                      Book a Verified Repair
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((req) => {
                      const Icon = CATEGORY_ICONS[req.category?.slug || ""] || Wrench;
                      const bookingRef = `RT-BLR-${req.id.slice(0, 8).toUpperCase()}`;
                      const quotesCount = req.quotes?.length || 0;

                      return (
                        <div
                          key={req.id}
                          className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 sm:p-6"
                        >
                          {/* Top Bar: Category, Reference & Status */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-base text-slate-900">
                                    {req.category?.name || "Repair Request"}
                                  </span>
                                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                    {bookingRef}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-500">
                                  Booked on {new Date(req.created_at).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>

                            <div>{getStatusBadge(req.request_status)}</div>
                          </div>

                          {/* Middle: Details & Location */}
                          <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="md:col-span-2 space-y-1.5">
                              <span className="font-semibold text-slate-700 uppercase tracking-wider block text-[11px]">
                                Problem Reported
                              </span>
                              <p className="text-sm font-medium text-slate-900 leading-snug">
                                {req.title}
                              </p>
                              <p className="text-slate-600 text-xs line-clamp-2">
                                {req.description}
                              </p>
                            </div>

                            <div className="space-y-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
                              <div className="flex items-center gap-2 text-slate-700">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">
                                  {req.address?.area || req.problem_details?.locality || "Bengaluru"}
                                  {req.address?.pincode ? ` (${req.address.pincode})` : ""}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-700">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="capitalize">{req.preferred_time || "Urgent (Within 2 Hours)"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Section: Quotes Banner or Cards */}
                          {quotesCount === 0 ? (
                            <div className="mt-2 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                              <div className="flex items-center gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                                <span>
                                  <strong>Technicians in {req.address?.area || "your zone"}</strong> are reviewing your fault details. Quotes will appear here shortly.
                                </span>
                              </div>
                              <span className="font-semibold text-emerald-700 hidden sm:inline-block">
                                0 Advance Payment Guarantee
                              </span>
                            </div>
                          ) : (
                            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                                Quotations Received ({quotesCount})
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {req.quotes?.map((q) => (
                                  <div
                                    key={q.id}
                                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 flex flex-col justify-between"
                                  >
                                    <div>
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <p className="font-bold text-sm text-slate-900">
                                            {q.technician?.business_name || q.technician?.user?.full_name || "Verified Technician"}
                                          </p>
                                          <div className="flex items-center gap-1 text-amber-500 text-xs mt-0.5">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <span className="font-semibold text-slate-700">
                                              {q.technician?.average_rating || "4.9"}
                                            </span>
                                            <span className="text-slate-400">
                                              ({q.technician?.total_jobs || 48} jobs completed)
                                            </span>
                                          </div>
                                        </div>
                                        <span className="text-base font-bold text-emerald-700">
                                          {formatCurrency(q.total_amount)}
                                        </span>
                                      </div>

                                      <div className="text-[11px] text-slate-600 space-y-1 my-2 border-t border-slate-200/60 pt-2">
                                        <div className="flex justify-between">
                                          <span>Labour Estimate:</span>
                                          <span className="font-medium text-slate-800">{formatCurrency(q.labour_cost)}</span>
                                        </div>
                                        {q.parts_cost > 0 && (
                                          <div className="flex justify-between">
                                            <span>Estimated Parts:</span>
                                            <span className="font-medium text-slate-800">{formatCurrency(q.parts_cost)}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between">
                                          <span>Est. Time:</span>
                                          <span className="font-medium text-slate-800">{q.estimated_completion_time || "45 - 60 mins"}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => handleAcceptQuote(q.id)}
                                      disabled={acceptingQuoteId === q.id}
                                      className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm text-center flex items-center justify-center gap-1.5 disabled:opacity-60"
                                    >
                                      {acceptingQuoteId === q.id ? (
                                        <>
                                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                          Confirming Booking...
                                        </>
                                      ) : (
                                        "Accept & Confirm Booking"
                                      )}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Confirmed Bookings & Doorstep Tracking */}
            {activeTab === "bookings" && (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <Navigation className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No confirmed bookings yet</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto mb-4">
                      When you accept a quote from a verified technician, your active booking with doorstep tracking will appear here.
                    </p>
                  </div>
                ) : (
                  bookings.map((booking) => {
                    const bookingRef = `RT-BKG-${booking.id.slice(0, 8).toUpperCase()}`;
                    const status = booking.booking_status;

                    let stepNumber = 1;
                    if (status === "confirmed") stepNumber = 1;
                    else if (status === "technician_en_route") stepNumber = 2;
                    else if (status === "arrived") stepNumber = 3;
                    else if (status === "in_progress") stepNumber = 4;
                    else if (status === "completed") stepNumber = 5;

                    return (
                      <div
                        key={booking.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base text-slate-900">
                                {booking.request?.category?.name || "Appliance Repair"}
                              </span>
                              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {bookingRef}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">
                              Service Time: {new Date(booking.scheduled_at).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                          </div>

                          <div>{getStatusBadge(status)}</div>
                        </div>

                        {/* Assigned Technician Card */}
                        <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                              {booking.technician?.business_name ? booking.technician.business_name.charAt(0) : "T"}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900">
                                {booking.technician?.business_name || "Verified Technician"}
                              </p>
                              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                <span className="font-semibold text-slate-800">
                                  {booking.technician?.average_rating || 4.9}
                                </span>
                                <span>• 100% Background Checked</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setChatBooking(booking)}
                              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              Chat
                            </button>
                            {booking.technician?.profile?.phone && (
                              <a
                                href={`tel:${booking.technician.profile.phone}`}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                Call Technician
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Doorstep Safety Verification Code */}
                        {["confirmed", "technician_en_route", "arrived"].includes(status) && (
                          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                <Key className="w-4 h-4" />
                              </div>
                              <div>
                                <strong className="text-amber-950 block font-bold">Doorstep Safety Verification Code</strong>
                                <span className="text-amber-800 text-[11px]">
                                  Share this 4-digit code with {booking.technician?.business_name || "the technician"} when they arrive at your door to begin service.
                                </span>
                              </div>
                            </div>
                            <div className="bg-white px-3.5 py-1.5 rounded-xl border border-amber-300 text-center shadow-xs shrink-0 self-start sm:self-auto">
                              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Start Job OTP</span>
                              <span className="text-base font-extrabold text-amber-700 font-mono tracking-widest">
                                {Math.abs(booking.id.split("").reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) % 9000, 7)) + 1000}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Live Doorstep Stepper */}
                        <div className="my-4 py-3 border-t border-b border-slate-100">
                          <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-semibold">
                            <div className={stepNumber >= 1 ? "text-emerald-700" : "text-slate-400"}>
                              1. Confirmed
                            </div>
                            <div className={stepNumber >= 2 ? "text-emerald-700" : "text-slate-400"}>
                              2. En Route 🚗
                            </div>
                            <div className={stepNumber >= 3 ? "text-emerald-700" : "text-slate-400"}>
                              3. Arrived 🚪
                            </div>
                            <div className={stepNumber >= 4 ? "text-emerald-700" : "text-slate-400"}>
                              4. In Progress 🔧
                            </div>
                            <div className={stepNumber >= 5 ? "text-emerald-700" : "text-slate-400"}>
                              5. Completed ✅
                            </div>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full transition-all duration-300"
                              style={{ width: `${(stepNumber / 5) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Completion / Warranty & Review Banner */}
                        {status === "completed" && (
                          <div className="mt-3 p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                              <div>
                                <strong className="text-emerald-950 block">RepairTrust 60-Day Warranty Active</strong>
                                <span className="text-emerald-800">
                                  Free doorstep re-inspection and parts guarantee active until {booking.warranty?.warranty_end_date || "60 Days"}.
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {paidBookingIds.has(booking.id) ? (
                                <button
                                  type="button"
                                  onClick={() => setInvoiceBooking(booking)}
                                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                                >
                                  <Receipt className="w-3.5 h-3.5" />
                                  Tax Invoice
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setPaymentBooking(booking)}
                                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm animate-pulse"
                                >
                                  <QrCode className="w-3.5 h-3.5" />
                                  Pay {formatCurrency(booking.final_amount)}
                                </button>
                              )}

                              {!booking.review ? (
                                <button
                                  onClick={() => setReviewBookingId(booking.id)}
                                  className="px-3.5 py-2 bg-[#101828] text-white font-semibold text-xs rounded-xl hover:bg-[#1E293B] shrink-0"
                                >
                                  Rate Technician
                                </button>
                              ) : (
                                <div className="flex items-center gap-1 font-semibold text-emerald-900 bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200">
                                  <span>Rated:</span>
                                  <div className="flex items-center text-amber-500">
                                    {Array.from({ length: booking.review.rating }).map((_, i) => (
                                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 3: Digital Warranties */}
            {activeTab === "warranties" && (
              <div className="space-y-4">
                {activeWarranties.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <Award className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No active warranties</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto mb-4">
                      Completed repair bookings automatically generate a 30 to 90-day RepairTrust Digital Warranty Certificate.
                    </p>
                  </div>
                ) : (
                  activeWarranties.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border-2 border-emerald-500/30 p-6 shadow-sm relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Certified Warranty
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-slate-900">
                            RepairTrust Service Warranty Certificate
                          </h4>
                          <span className="text-xs text-slate-500">
                            Booking ID: RT-BKG-{b.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                        <div>
                          <span className="text-slate-500 block mb-0.5">Service:</span>
                          <strong className="text-slate-900">{b.request?.category?.name || "Repair"}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">Warranty Period:</span>
                          <strong className="text-emerald-700">60 Days Complete Protection</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">Valid Until:</span>
                          <strong className="text-slate-900">{b.warranty?.warranty_end_date || "60 Days from completion"}</strong>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-xs text-slate-600 leading-relaxed max-w-md">
                          This digital certificate guarantees that the service performed meets RepairTrust quality and parts standards. In case of recurring fault symptoms, free doorstep re-inspection and parts rework is guaranteed under the RepairTrust Customer Charter.
                        </p>
                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setClaimBooking(b)}
                            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-700" />
                            Claim 60-Day Guarantee
                          </button>
                          <button
                            type="button"
                            onClick={() => setInvoiceBooking(b)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            View Tax Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Review Modal */}
      {reviewBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm"
            onClick={() => setReviewBookingId(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Rate Your Technician</h3>
            <p className="text-xs text-slate-500 mb-4">
              Your verified review helps maintain our high-quality service standard in Bengaluru.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Overall Service Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? "text-amber-500 fill-amber-500"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-slate-700 ml-2">{reviewRating} / 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Review & Feedback (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Share your experience (punctuality, clean work, communication)..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setReviewBookingId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm disabled:opacity-60"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Verified Review"}
                </button>
              </div>
            </form>
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

      {/* 5. Payment, Invoice & Chat Modals */}
      <PaymentModal
        isOpen={!!paymentBooking}
        onClose={() => setPaymentBooking(null)}
        booking={paymentBooking}
        onPaymentSuccess={() => {
          if (paymentBooking) {
            setPaidBookingIds((prev) => new Set(prev).add(paymentBooking.id));
          }
          fetchData();
        }}
        onViewInvoice={() => {
          setInvoiceBooking(paymentBooking);
        }}
      />

      <InvoiceModal
        isOpen={!!invoiceBooking}
        onClose={() => setInvoiceBooking(null)}
        booking={invoiceBooking}
      />

      {chatBooking && (
        <ChatModal
          isOpen={!!chatBooking}
          onClose={() => setChatBooking(null)}
          bookingId={chatBooking.id}
          recipientName={chatBooking.technician?.business_name || "Assigned Technician"}
          recipientRole="Technician"
          recipientPhone={chatBooking.technician?.profile?.phone}
          serviceTitle={chatBooking.request?.title || "Doorstep Repair"}
        />
      )}

      {claimBooking && (
        <WarrantyClaimModal
          isOpen={!!claimBooking}
          onClose={() => setClaimBooking(null)}
          booking={claimBooking}
          onClaimSubmitted={() => {
            fetchData();
          }}
        />
      )}
    </div>
  );
}
