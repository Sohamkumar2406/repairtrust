"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Wrench,
  DollarSign,
  TrendingUp,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Calendar,
  Phone,
  Mail,
  Award,
  Sparkles,
  ArrowUpRight,
  UserCheck,
  FileText,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/modals/BookingModal";
import { TechnicianModal } from "@/components/modals/TechnicianModal";
import { AuthModal } from "@/components/modals/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";

interface AdminStats {
  totalCustomers: number;
  totalTechnicians: number;
  verifiedTechnicians: number;
  pendingKYC: number;
  totalRequests: number;
  totalBookings: number;
  totalGMV: number;
  platformCommission: number;
}

interface TechnicianProfileItem {
  id: string;
  user_id: string;
  business_name: string;
  experience_years: number;
  bio?: string;
  verification_status: "pending" | "verified" | "rejected" | "under_review";
  average_rating: number;
  total_jobs: number;
  created_at: string;
  user?: {
    full_name: string;
    phone: string;
    email?: string;
    avatar_url?: string;
  };
  documents?: Array<{
    id: string;
    document_type: string;
    storage_path: string;
    verification_status: string;
  }>;
}

interface MasterBookingItem {
  id: string;
  scheduled_at: string;
  booking_status: string;
  final_amount: number;
  completion_date?: string;
  created_at: string;
  customer?: {
    full_name: string;
    phone: string;
    email?: string;
  };
  technician?: {
    business_name: string;
    average_rating: number;
    profile?: {
      full_name: string;
      phone: string;
    };
  };
  request?: {
    title: string;
    category?: { name: string };
    address?: { address_line: string; area: string; pincode: string };
  };
  warranty?: {
    warranty_period_days: number;
    warranty_end_date: string;
    warranty_status: string;
  };
}

export default function AdminOperationsPage() {
  const { user, profile, isAuthenticated } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [technicians, setTechnicians] = useState<TechnicianProfileItem[]>([]);
  const [bookings, setBookings] = useState<MasterBookingItem[]>([]);

  const [activeTab, setActiveTab] = useState<"kyc" | "bookings" | "revenue">("kyc");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [updatingTechId, setUpdatingTechId] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTechnicianOpen, setIsTechnicianOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("Koramangala");

  const fetchAdminData = useCallback(async () => {
    try {
      setError("");
      const [statsRes, techsRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/technicians"),
        fetch("/api/admin/bookings"),
      ]);

      const statsData = await statsRes.json();
      if (statsRes.ok && statsData.success) {
        setStats(statsData.stats);
      }

      const techsData = await techsRes.json();
      if (techsRes.ok && techsData.success) {
        setTechnicians(techsData.data || []);
      }

      const bookingsData = await bookingsRes.json();
      if (bookingsRes.ok && bookingsData.success) {
        setBookings(bookingsData.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAdminData();
  };

  const handleUpdateTechnicianKYC = async (
    technicianId: string,
    status: "verified" | "rejected" | "under_review"
  ) => {
    setUpdatingTechId(technicianId);
    try {
      const res = await fetch("/api/admin/technicians", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId,
          verificationStatus: status,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await fetchAdminData();
      } else {
        alert(data.error || "Failed to update verification status");
      }
    } catch (err: any) {
      alert(err.message || "Failed to connect to server");
    } finally {
      setUpdatingTechId(null);
    }
  };

  const handleSeedDemoNetwork = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchAdminData();
        alert(data.message || "Seeded successfully!");
      } else {
        alert(data.error || "Failed to seed demo network");
      }
    } catch (err: any) {
      alert(err.message || "Failed to connect to server");
    } finally {
      setIsSeeding(false);
    }
  };

  const filteredTechnicians = technicians.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.business_name?.toLowerCase().includes(q) ||
      t.user?.full_name?.toLowerCase().includes(q) ||
      t.user?.phone?.includes(q) ||
      t.verification_status?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* 1. Navigation */}
      <Navbar
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenTechnician={() => setIsTechnicianOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      {/* 2. Main Admin Dashboard */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#101828] text-emerald-400 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    RepairTrust Admin Console
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#101828] text-white">
                    Master Ops
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bengaluru Metro Service Operations • Real-time KYC Verification & Payout Engine
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-sm disabled:opacity-50"
              title="Refresh console"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleSeedDemoNetwork}
              disabled={isSeeding}
              className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {isSeeding ? "Seeding..." : "Seed Bengaluru Leads"}
            </button>
            <Link
              href="/technician"
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              View Partner Portal
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-[#101828] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              View Customer App
            </Link>
          </div>
        </div>

        {/* Executive KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Platform GMV</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 block">
              {formatCurrency(stats?.totalGMV || 0)}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              100% Guaranteed Doorstep Volume
            </span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Platform Take (12%)</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-2xl font-extrabold text-blue-600 block">
              {formatCurrency(stats?.platformCommission || 0)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Net marketplace revenue</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Total Bookings</span>
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 block">
              {stats?.totalBookings || 0}
            </span>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">
              Across 8 Bengaluru Zones
            </span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Technician Network</span>
              <Wrench className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-600">
                {stats?.verifiedTechnicians || 0}
              </span>
              <span className="text-xs text-slate-500">Verified</span>
            </div>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
              {stats?.pendingKYC || 0} Pending Verification
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("kyc")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "kyc"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Technician Partners & KYC ({technicians.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "bookings"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            Master Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("revenue")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "revenue"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Revenue & Payout Ledger
          </button>
        </div>

        {/* TAB 1: Technician Partners & KYC Approvals */}
        {activeTab === "kyc" && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, business or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-600">Loading technician records...</p>
              </div>
            ) : filteredTechnicians.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm">No technician records found.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Technician / Business</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Experience</th>
                        <th className="py-3 px-4">Rating & Jobs</th>
                        <th className="py-3 px-4">KYC Status</th>
                        <th className="py-3 px-4 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTechnicians.map((tech) => (
                        <tr key={tech.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                {tech.business_name ? tech.business_name.charAt(0) : "T"}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block text-xs">
                                  {tech.business_name || "Partner Technician"}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  {tech.user?.full_name || "Owner"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <div>+91 {tech.user?.phone || "N/A"}</div>
                            <div className="text-slate-400 text-[10px]">{tech.user?.email}</div>
                          </td>

                          <td className="py-3.5 px-4 font-medium text-slate-800">
                            {tech.experience_years} Years
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1 font-semibold text-slate-900">
                              <span>{tech.average_rating || 4.9}</span>
                              <span className="text-amber-500">★</span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {tech.total_jobs || 0} jobs done
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {tech.verification_status === "verified" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Verified
                              </span>
                            ) : tech.verification_status === "rejected" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                                <XCircle className="w-3 h-3 text-red-600" />
                                Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Pending Review
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {tech.verification_status !== "verified" && (
                                <button
                                  onClick={() => handleUpdateTechnicianKYC(tech.id, "verified")}
                                  disabled={updatingTechId === tech.id}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg transition-colors shadow-sm disabled:opacity-60"
                                >
                                  {updatingTechId === tech.id ? "Saving..." : "Approve"}
                                </button>
                              )}
                              {tech.verification_status === "verified" && (
                                <button
                                  onClick={() => handleUpdateTechnicianKYC(tech.id, "rejected")}
                                  disabled={updatingTechId === tech.id}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-semibold text-[11px] rounded-lg transition-colors disabled:opacity-60"
                                >
                                  Revoke
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Master Bookings */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm">No bookings in the system yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Booking Ref</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Technician</th>
                        <th className="py-3 px-4">Service & Area</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            RT-BKG-{b.id.slice(0, 8).toUpperCase()}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-900 block">
                              {b.customer?.full_name || "Customer"}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                              +91 {b.customer?.phone}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-900 block">
                              {b.technician?.business_name || "Assigned Partner"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-900 block">
                              {b.request?.category?.name || "Appliance"}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {b.request?.address?.area || "Bengaluru"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                              {b.booking_status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">
                            {formatCurrency(b.final_amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Revenue & Commission Ledger */}
        {activeTab === "revenue" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Total Gross Value (GMV)</span>
                <span className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.totalGMV || 0)}</span>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Technician Payouts (88%)</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(Math.round((stats?.totalGMV || 0) * 0.88))}
                </span>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Platform Commission (12%)</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(stats?.platformCommission || 0)}</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm mb-2">Automated Marketplace Commission Policy</h4>
              <p>
                Under RepairTrust Bengaluru Charter, verified technicians receive 88% of final billing via weekly UPI settlement. The 12% platform fee funds 4-layer background checks, digital warranty insurance reserve, and customer dispute resolution.
              </p>
            </div>
          </div>
        )}
      </main>

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
      />
    </div>
  );
}
