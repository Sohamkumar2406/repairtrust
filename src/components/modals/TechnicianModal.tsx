"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  Building2,
  Phone,
  UserCheck,
  AlertCircle,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { BENGALURU_LOCATIONS } from "@/data/bengaluruLocations";
import { POPULAR_SERVICES } from "@/data/servicesData";

interface TechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TechnicianModal({ isOpen, onClose }: TechnicianModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [primaryTrade, setPrimaryTrade] = useState("ac-repair");
  const [experienceYears, setExperienceYears] = useState("3-5");
  const [location, setLocation] = useState("koramangala");
  const [hasTools, setHasTools] = useState(true);
  const [isBusiness, setIsBusiness] = useState("independent");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [partnerAppId, setPartnerAppId] = useState("");

  if (!isOpen) return null;

  const validate = () => {
    const err: { [key: string]: string } = {};
    if (!fullName.trim()) err.fullName = "Please enter your legal name as on Aadhaar";
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      err.phone = "Please enter a valid 10-digit mobile number";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const ref = `TECH-BLR-${Math.floor(1000 + Math.random() * 9000)}`;
      setPartnerAppId(ref);
      setIsSuccess(true);
    }, 850);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-[#101828] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">
                {isSuccess ? "Application Submitted" : "Join RepairTrust Technician Network"}
              </h3>
              <p className="text-xs text-slate-300">
                Bengaluru Partner Onboarding • 100% Direct Payouts
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-mono text-xs font-semibold rounded-full border border-emerald-200 mb-2">
              Application ID: {partnerAppId}
            </span>
            <h4 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome to the Network, {fullName}!
            </h4>
            <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
              Our Bengaluru Partner Verification team will call you within 24 hours at <strong>+91 {phone}</strong> to schedule your quick Aadhaar KYC verification and trade assessment.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs text-slate-600 max-w-md mx-auto mb-6 space-y-2">
              <p className="font-semibold text-slate-800">What to have ready for verification:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Original Government ID (Aadhaar or Driving License)</li>
                <li>Bengaluru address proof or current workshop location</li>
                <li>Basic tools of your trade for standard equipment check</li>
              </ul>
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-[#101828] text-white rounded-xl font-medium text-sm hover:bg-[#1E293B] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name (as per Govt ID)
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-medium text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Repair Trade
                </label>
                <select
                  value={primaryTrade}
                  onChange={(e) => setPrimaryTrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {POPULAR_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Years of Experience
                </label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="1-2">1 - 2 Years</option>
                  <option value="3-5">3 - 5 Years</option>
                  <option value="6-10">6 - 10 Years</option>
                  <option value="10+">10+ Years Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bengaluru Operating Base
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {BENGALURU_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} ({loc.zone} Zone)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Profile
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsBusiness("independent")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isBusiness === "independent"
                      ? "border-emerald-600 bg-emerald-50/50 text-slate-900"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="block font-medium text-xs">Independent Pro</span>
                  <span className="text-[11px] text-slate-500">Individual doorstep technician</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBusiness("workshop")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isBusiness === "workshop"
                      ? "border-emerald-600 bg-emerald-50/50 text-slate-900"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="block font-medium text-xs">Service Center / Shop</span>
                  <span className="text-[11px] text-slate-500">Established repair outlet</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Join as a Technician
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
