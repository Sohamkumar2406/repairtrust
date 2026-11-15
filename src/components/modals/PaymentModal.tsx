"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  QrCode,
  Banknote,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Receipt,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    final_amount: number;
    customer?: { full_name?: string; phone?: string };
    technician?: { business_name?: string };
    request?: {
      title?: string;
      category?: { name?: string };
      address?: { area?: string };
    };
  } | null;
  onPaymentSuccess: () => void;
  onViewInvoice: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  booking,
  onPaymentSuccess,
  onViewInvoice,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [transactionRef, setTransactionRef] = useState<string>("");

  if (!isOpen || !booking) return null;

  const totalAmount = Number(booking.final_amount) || 499;
  const baseServiceAmount = Math.round((totalAmount / 1.18) * 100) / 100;
  const gstAmount = Math.round((totalAmount - baseServiceAmount) * 100) / 100;
  const bookingRef = booking.id.slice(0, 8).toUpperCase();

  const upiId = "repairtrust.pay@icici";
  const upiPayString = `upi://pay?pa=${upiId}&pn=RepairTrust+Bengaluru&am=${totalAmount}&tn=RT-${bookingRef}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiPayString
  )}`;

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: totalAmount,
          paymentMethod,
          notes: `Doorstep settlement for ${booking.request?.title || "Repair service"}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        setTransactionRef(data.receipt?.transactionRef || `PAY-RT-${Date.now().toString().slice(-6)}`);
        onPaymentSuccess();
      } else {
        setError(data.error || "Failed to confirm payment");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to server");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
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
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Doorstep Payment & Settlement</h2>
              <p className="text-xs text-slate-300">
                Booking #{bookingRef} • Bengaluru Doorstep Guarantee
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">Payment Verified!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Transaction Ref: <span className="font-mono font-bold text-slate-800">{transactionRef}</span>
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Amount Settled:</span>
                  <strong className="text-emerald-700 text-sm font-bold">{formatCurrency(totalAmount)}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Technician Partner:</span>
                  <span className="font-semibold text-slate-800">{booking.technician?.business_name || "Verified Expert"}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Warranty Status:</span>
                  <span className="font-semibold text-emerald-700">60-Day Protection Activated</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onViewInvoice();
                  }}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-4 h-4" />
                  View & Print Tax Invoice
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Service & Technician Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{booking.request?.title || "Appliance Repair"}</h4>
                  <p className="text-[11px] text-slate-500">
                    Technician: <strong className="text-slate-700">{booking.technician?.business_name || "Verified Partner"}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Total Due</span>
                  <span className="text-xl font-extrabold text-slate-900">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Doorstep Payment Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === "upi"
                        ? "border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        paymentMethod === "upi" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Instant UPI QR</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">GPay • PhonePe • Paytm</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === "cash"
                        ? "border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        paymentMethod === "cash" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Doorstep Cash</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Pay directly to tech</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* UPI QR Display */}
              {paymentMethod === "upi" ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 inline-block shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrCodeUrl}
                      alt="RepairTrust UPI QR Code"
                      width={180}
                      height={180}
                      className="mx-auto rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Scan using Google Pay, PhonePe, Paytm, or BHIM
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      UPI ID: {upiId}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>0% transaction fee • Instant escrow verification</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-1">
                  <strong className="block text-amber-950 font-bold">Doorstep Cash Settlement Policy</strong>
                  <p>
                    Please hand over exact cash of <strong className="font-bold">{formatCurrency(totalAmount)}</strong> to the verified technician. The technician will confirm receipt and provide your digital warranty receipt.
                  </p>
                </div>
              )}

              {/* Bill Breakdown */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Diagnostic & Service Labor:</span>
                  <span>{formatCurrency(baseServiceAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>GST (18% SAC 998719):</span>
                  <span>{formatCurrency(gstAmount)}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Payable:</span>
                  <span className="text-emerald-700">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm {paymentMethod === "upi" ? "UPI Payment" : "Cash Received"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
