"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Award,
  AlertCircle,
  CheckCircle2,
  Clock,
  Wrench,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface WarrantyClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    final_amount: number;
    completion_date?: string;
    technician?: { business_name?: string };
    request?: {
      title?: string;
      category?: { name?: string };
      address?: { area?: string };
    };
    warranty?: {
      warranty_period_days?: number;
      warranty_end_date?: string;
      warranty_status?: string;
    };
  } | null;
  onClaimSubmitted: () => void;
}

const COMMON_SYMPTOMS = [
  { id: "recurrent_fault", label: "Same Problem Recurring" },
  { id: "stopped_working", label: "Appliance Stopped Working Again" },
  { id: "abnormal_noise", label: "Unusual Noise or Vibration" },
  { id: "leakage", label: "Refrigerant or Water Leakage" },
  { id: "parts_issue", label: "Replaced Part Malfunction" },
];

const PREFERRED_SLOTS = [
  "Urgent (Within 4 Hours)",
  "Tomorrow Morning (9 AM - 12 PM)",
  "Tomorrow Afternoon (12 PM - 4 PM)",
  "Tomorrow Evening (4 PM - 8 PM)",
];

export function WarrantyClaimModal({
  isOpen,
  onClose,
  booking,
  onClaimSubmitted,
}: WarrantyClaimModalProps) {
  const [selectedSymptom, setSelectedSymptom] = useState<string>("recurrent_fault");
  const [description, setDescription] = useState<string>("");
  const [preferredSlot, setPreferredSlot] = useState<string>("Tomorrow Morning (9 AM - 12 PM)");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [claimTicket, setClaimTicket] = useState<string>("");

  if (!isOpen || !booking) return null;

  const bookingRef = booking.id.slice(0, 8).toUpperCase();

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Please describe the fault symptom so the technician brings proper diagnostic tools.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/warranty/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          symptom: selectedSymptom,
          description: description.trim(),
          preferredSlot,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setClaimTicket(data.claimTicketRef || `CLM-RT-${Date.now().toString().slice(-6)}`);
        onClaimSubmitted();
      } else {
        setError(data.error || "Failed to submit warranty claim");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setClaimTicket("");
    setError("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#101828] text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Claim 60-Day Warranty Protection</h2>
              <p className="text-xs text-slate-300">
                Booking #{bookingRef} • {booking.request?.title || "Home Repair"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {claimTicket ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">Warranty Claim Registered!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ticket Reference: <span className="font-mono font-bold text-slate-800">{claimTicket}</span>
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-950 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Free Doorstep Re-Inspection Guaranteed</span>
                </div>
                <p className="text-emerald-800 leading-relaxed text-[11px]">
                  Your verified partner <strong className="font-bold">{booking.technician?.business_name || "Assigned Technician"}</strong> has been notified to re-inspect and fix the appliance at zero diagnostic charge under your 60-Day Guarantee.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 px-4 bg-[#101828] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitClaim} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Zero-Cost Charter Guarantee Banner */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-emerald-950">
                  <span className="font-bold block">₹0 Doorstep Diagnostic Charge</span>
                  <span className="text-[11px] text-emerald-800">
                    Your service is covered under RepairTrust Bengaluru 60-Day Free Rework Protection.
                  </span>
                </div>
              </div>

              {/* Symptom Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  What issue are you experiencing?
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SYMPTOMS.map((sym) => (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => setSelectedSymptom(sym.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedSymptom === sym.id
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500 font-bold"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700"
                      }`}
                    >
                      {sym.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fault Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Describe the Recurring Problem
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. The cooling stopped again yesterday after 2 weeks, compressor is making a buzzing sound..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Preferred Re-visit Slot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Preferred Doorstep Re-visit Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PREFERRED_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPreferredSlot(slot)}
                      className={`p-2.5 rounded-xl border text-left text-[11px] font-medium transition-all ${
                        preferredSlot === slot
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold ring-1 ring-emerald-500"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scheduling Free Visit...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Free Re-visit</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
