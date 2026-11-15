"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: "customer" | "technician";
}

export function AuthModal({ isOpen, onClose, defaultRole = "customer" }: AuthModalProps) {
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"customer" | "technician">(defaultRole);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [experienceYears, setExperienceYears] = useState("3");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setBusinessName("");
    setError("");
    setSuccessMessage("");
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (mode === "signup") {
      if (!fullName.trim()) {
        setError("Please enter your full name");
        return;
      }
      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length !== 10) {
        setError("Please enter a valid 10-digit Indian phone number");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === "signin") {
        const result = await signInWithEmail(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          setIsSuccess(true);
          setSuccessMessage("Welcome back to RepairTrust!");
          setTimeout(() => {
            handleClose();
          }, 1200);
        }
      } else {
        const result = await signUpWithEmail(email, password, {
          fullName,
          phone: phone.replace(/\D/g, ""),
          role,
          businessName: role === "technician" ? businessName || `${fullName} Services` : undefined,
          experienceYears: role === "technician" ? parseInt(experienceYears, 10) || 2 : undefined,
        });

        if (result.error) {
          setError(result.error);
        } else if (result.requireVerification) {
          setIsSuccess(true);
          setSuccessMessage("Account created! Please check your email to confirm your registration.");
        } else {
          setIsSuccess(true);
          setSuccessMessage("Account created successfully!");
          setTimeout(() => {
            handleClose();
          }, 1400);
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-[#101828] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-base block leading-tight">RepairTrust</span>
              <span className="text-[11px] text-slate-400">
                {role === "technician" ? "Technician Partner Portal" : "Bengaluru Doorstep Repairs"}
              </span>
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
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-1">Success!</h4>
            <p className="text-sm text-slate-600 mb-6">{successMessage}</p>
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-[#101828] text-white rounded-xl font-medium text-sm hover:bg-[#1E293B] transition-colors"
            >
              Continue to RepairTrust
            </button>
          </div>
        ) : (
          <div className="p-6">
            {/* Role selector */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => {
                  setRole("customer");
                  setError("");
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  role === "customer"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Customer Portal
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("technician");
                  setError("");
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  role === "technician"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Technician Partner
              </button>
            </div>

            {/* Mode toggle (Sign In vs Sign Up) */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {mode === "signin"
                    ? role === "technician"
                      ? "Technician Sign In"
                      : "Welcome Back"
                    : role === "technician"
                    ? "Join as Verified Technician"
                    : "Create Customer Account"}
                </h3>
                <p className="text-xs text-slate-500">
                  {mode === "signin"
                    ? "Enter your credentials to access your account"
                    : "Fill in details to get started with RepairTrust"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError("");
                }}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
              >
                {mode === "signin" ? "New User? Sign Up" : "Existing? Sign In"}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === "signup" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (10 digits) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-semibold text-slate-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-11 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {role === "technician" && (
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Business / Workshop
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Precision HVAC"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Experience (Years)
                        </label>
                        <select
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        >
                          <option value="1">1+ years</option>
                          <option value="3">3+ years</option>
                          <option value="5">5+ years</option>
                          <option value="10">10+ years</option>
                        </select>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Minimum 6 characters
                </span>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {mode === "signin" ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  By continuing, you agree to RepairTrust&apos;s Verified Service Terms & Privacy Charter.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
