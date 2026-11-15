"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  UploadCloud,
  ImageIcon,
  Trash2,
  UserCheck,
} from "lucide-react";
import { POPULAR_SERVICES, ServiceCategory } from "@/data/servicesData";
import { BENGALURU_LOCATIONS } from "@/data/bengaluruLocations";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  prefilledIssue?: string;
  preselectedLocation?: string;
}

export function BookingModal({
  isOpen,
  onClose,
  preselectedServiceId,
  prefilledIssue,
  preselectedLocation,
}: BookingModalProps) {
  const { user, profile, isAuthenticated } = useAuth();

  const [serviceId, setServiceId] = useState<string>(preselectedServiceId || "ac-repair");
  const [selectedIssue, setSelectedIssue] = useState<string>(prefilledIssue || "");
  const [customIssue, setCustomIssue] = useState<string>("");
  const [location, setLocation] = useState<string>(preselectedLocation || "Koramangala");
  const [addressDetails, setAddressDetails] = useState<string>("");
  const [preferredDate, setPreferredDate] = useState<string>("today");
  const [preferredTime, setPreferredTime] = useState<string>("asap");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");

  // Media upload state
  const [mediaPaths, setMediaPaths] = useState<string[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>("");

  // Prefill authenticated user profile data
  useEffect(() => {
    if (profile?.full_name && !customerName) {
      setCustomerName(profile.full_name);
    }
    if (profile?.phone && profile.phone !== "0000000000" && !customerPhone) {
      setCustomerPhone(profile.phone);
    }
    if (user?.email && !customerEmail) {
      setCustomerEmail(user.email);
    }
  }, [profile, user, customerName, customerPhone, customerEmail]);

  useEffect(() => {
    if (preselectedServiceId) {
      setServiceId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  useEffect(() => {
    if (prefilledIssue) {
      setSelectedIssue(prefilledIssue);
    }
  }, [prefilledIssue]);

  useEffect(() => {
    if (preselectedLocation) {
      setLocation(preselectedLocation);
    }
  }, [preselectedLocation]);

  if (!isOpen) return null;

  const currentService: ServiceCategory =
    POPULAR_SERVICES.find((s) => s.id === serviceId) || POPULAR_SERVICES[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    setErrors((prev) => ({ ...prev, upload: "" }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "repair-request-media");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.storagePath) {
        setMediaPaths((prev) => [...prev, data.storagePath]);
      } else {
        setErrors((prev) => ({ ...prev, upload: data.error || "Failed to upload image" }));
      }
    } catch {
      setErrors((prev) => ({ ...prev, upload: "Failed to upload image" }));
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const removeMedia = (index: number) => {
    setMediaPaths((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const err: { [key: string]: string } = {};
    if (!customerName.trim()) {
      err.customerName = "Please enter your name";
    }
    const cleanPhone = customerPhone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      err.customerPhone = "Please enter a valid 10-digit mobile number";
    }
    if (!selectedIssue && !customIssue.trim()) {
      err.issue = "Please select or describe the repair issue";
    }
    if (!addressDetails.trim()) {
      err.address = "Please provide your street or apartment address";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const payload = {
        serviceId,
        selectedIssue,
        customIssue,
        location,
        addressDetails,
        preferredTime,
        customerName,
        customerPhone,
        customerEmail: user?.email || customerEmail,
        mediaPaths,
      };

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setBookingRef(result.bookingRef || `RT-BLR-${Math.floor(1000 + Math.random() * 9000)}`);
        setBookingSuccess(true);
      } else {
        setServerError(result.error || "Failed to submit request. Please try again.");
      }
    } catch (err: any) {
      setServerError(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setBookingSuccess(false);
    setErrors({});
    setServerError("");
    setMediaPaths([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm transition-opacity"
        onClick={handleResetAndClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-[#101828] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">
                {bookingSuccess ? "Repair Request Broadcasted" : "Request Transparent Quotation"}
              </h3>
              <p className="text-xs text-slate-300">
                Bengaluru Doorstep Repairs • 100% Background-Checked Technicians
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {bookingSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-mono text-xs font-semibold rounded-full border border-emerald-200 mb-2">
              Booking Ref: {bookingRef}
            </span>
            <h4 className="text-2xl font-bold text-slate-900 mb-2">
              Your Request is Live in Database!
            </h4>
            <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
              Verified technicians serving <strong>{location}</strong> have received your request for <strong>{currentService.name}</strong>. You will receive transparent quotes via SMS/WhatsApp on <strong>+91 {customerPhone}</strong>.
            </p>

            {/* Transparent Quote Breakdown Preview */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-left max-w-md mx-auto mb-6 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>Protection & Service Terms</span>
                <span className="text-emerald-600 font-medium">Verified by RepairTrust</span>
              </div>
              <div className="flex justify-between text-sm text-slate-700">
                <span>Standard Doorstep Diagnosis</span>
                <span className="font-medium text-slate-900">{formatCurrency(199)} (Adjusted in repair)</span>
              </div>
              <div className="flex justify-between text-sm text-slate-700">
                <span>Labor Starting At</span>
                <span className="font-medium text-slate-900">{formatCurrency(currentService.startingPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-700">
                <span>Service Warranty</span>
                <span className="font-semibold text-emerald-600">{currentService.warrantyDays} Days Guaranteed</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs text-slate-500">
                <span>Advance Payment Required</span>
                <span className="font-semibold text-slate-800">₹0 (Pay after satisfaction)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors text-center shadow-sm"
              >
                Track in My Dashboard
              </Link>
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-medium text-sm transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Authenticated user indicator */}
            {isAuthenticated && (
              <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs text-emerald-800">
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Booking with your verified account: <strong>{profile?.full_name || user?.email}</strong>
                </span>
              </div>
            )}

            {/* Service & Issue Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Service & Issue
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Category</label>
                  <select
                    value={serviceId}
                    onChange={(e) => {
                      setServiceId(e.target.value);
                      setSelectedIssue("");
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {POPULAR_SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (from {formatCurrency(s.startingPrice)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Common Symptoms</label>
                  <select
                    value={selectedIssue}
                    onChange={(e) => setSelectedIssue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="">Choose common issue...</option>
                    {currentService.popularIssues.map((issue) => (
                      <option key={issue} value={issue}>
                        {issue}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Or describe the exact problem in your own words..."
                  value={customIssue}
                  onChange={(e) => setCustomIssue(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                {errors.issue && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.issue}
                  </p>
                )}
              </div>
            </div>

            {/* Location & Address */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                2. Bengaluru Location
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Locality / Zone</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      {BENGALURU_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name} ({loc.pincode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Timing Preference</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="asap">Urgent (Within 2 Hours)</option>
                      <option value="today-evening">Today Evening (5 PM - 8 PM)</option>
                      <option value="tomorrow-morning">Tomorrow Morning (9 AM - 12 PM)</option>
                      <option value="tomorrow-afternoon">Tomorrow Afternoon (12 PM - 4 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Apartment name, Flat/House No., Street name..."
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Optional Media Upload */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                3. Photo of Appliance / Fault (Optional)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 cursor-pointer transition-colors">
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  <span>{isUploadingMedia ? "Uploading..." : "Upload Photo / Video"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploadingMedia}
                    className="hidden"
                  />
                </label>

                {mediaPaths.map((path, idx) => (
                  <div
                    key={path}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Photo {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="text-slate-400 hover:text-red-500 ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.upload && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.upload}
                </p>
              )}
            </div>

            {/* Customer Contact Details */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                4. Your Contact Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.customerName}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-medium text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-12 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                  {errors.customerPhone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.customerPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Trust Assurance Banner */}
            <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>RepairTrust Guarantee:</strong> Upfront quotation matching, zero advance diagnosis payment, and a <strong>{currentService.warrantyDays}-day warranty</strong> with a digital certificate.
              </span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
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
                    Broadcasting to Technicians...
                  </>
                ) : (
                  <>
                    Request Quotations
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
