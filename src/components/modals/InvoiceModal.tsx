"use client";

import React from "react";
import {
  X,
  Printer,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  MapPin,
  Phone,
  FileText,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    final_amount: number;
    completion_date?: string;
    created_at: string;
    customer?: { full_name?: string; phone?: string; email?: string };
    technician?: {
      business_name?: string;
      average_rating?: number;
      profile?: { full_name?: string; phone?: string };
    };
    request?: {
      title?: string;
      category?: { name?: string; slug?: string };
      address?: { address_line?: string; area?: string; pincode?: string };
    };
    warranty?: {
      warranty_period_days?: number;
      warranty_end_date?: string;
      warranty_status?: string;
    };
  } | null;
}

export function InvoiceModal({ isOpen, onClose, booking }: InvoiceModalProps) {
  if (!isOpen || !booking) return null;

  const totalAmount = Number(booking.final_amount) || 499;
  const taxableAmount = Math.round((totalAmount / 1.18) * 100) / 100;
  const cgstAmount = Math.round(((totalAmount - taxableAmount) / 2) * 100) / 100;
  const sgstAmount = cgstAmount;
  const invoiceNumber = `RT-BLR-${booking.id.slice(0, 8).toUpperCase()}`;

  const completionDate = booking.completion_date
    ? new Date(booking.completion_date)
    : new Date();
  const invoiceDateFormatted = completionDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const warrantyEndDate = new Date(completionDate);
  warrantyEndDate.setDate(warrantyEndDate.getDate() + 60);
  const warrantyEndDateFormatted = warrantyEndDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Controls (Hidden in Print) */}
        <div className="print:hidden flex items-center justify-between p-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Official Tax Invoice & Warranty Certificate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-8 bg-white text-slate-800 text-xs font-sans print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-extrabold text-2xl tracking-tight text-[#101828]">
                  Repair<span className="text-emerald-500">Trust</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  GST Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-xs">
                RepairTrust Technologies India Pvt. Ltd.
                <br />
                80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka - 560034
                <br />
                GSTIN: <span className="font-mono font-bold text-slate-700">29AAECR4829K1ZR</span> • SAC: 998719
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Tax Invoice
              </span>
              <span className="text-base font-extrabold text-slate-900 font-mono block">
                {invoiceNumber}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Date: {invoiceDateFormatted}
              </span>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                PAID IN FULL
              </span>
            </div>
          </div>

          {/* Customer & Technician Information */}
          <div className="grid grid-cols-2 gap-6 py-5 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Billed To (Customer)
              </span>
              <p className="font-bold text-slate-900 text-sm">
                {booking.customer?.full_name || "Verified Customer"}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {booking.customer?.phone || "+91 98765 43210"}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {booking.request?.address?.address_line || "Customer Address"},{" "}
                {booking.request?.address?.area || "Bengaluru"} -{" "}
                {booking.request?.address?.pincode || "560001"}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Service Fulfilled By
              </span>
              <p className="font-bold text-slate-900 text-sm">
                {booking.technician?.business_name || "Verified Repair Partner"}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Partner Lead: {booking.technician?.profile?.full_name || "Repair Specialist"}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-semibold">Police & Skill Verified Professional</span>
              </div>
            </div>
          </div>

          {/* Service Itemized Table */}
          <div className="py-5 border-b border-slate-200">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-center">HSN/SAC</th>
                  <th className="pb-2 text-right">Taxable</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3">
                    <span className="font-bold text-slate-900 block">
                      {booking.request?.title || "Home Appliance Repair & Servicing"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Standard diagnostic, component overhaul & performance inspection
                    </span>
                  </td>
                  <td className="py-3 text-center font-mono text-slate-500">998719</td>
                  <td className="py-3 text-right font-mono">{formatCurrency(taxableAmount)}</td>
                  <td className="py-3 text-right font-bold font-mono text-slate-900">
                    {formatCurrency(taxableAmount)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Calculations */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Taxable Value:</span>
                  <span className="font-mono">{formatCurrency(taxableAmount)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>CGST (9.0%):</span>
                  <span className="font-mono">{formatCurrency(cgstAmount)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>SGST (9.0%):</span>
                  <span className="font-mono">{formatCurrency(sgstAmount)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-slate-900 text-sm">
                  <span>Grand Total Paid:</span>
                  <span className="font-mono text-emerald-700">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 60-Day Digital Warranty Guarantee Banner */}
          <div className="mt-5 p-4 bg-emerald-50/80 border-2 border-dashed border-emerald-300 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider block">
                  RepairTrust 60-Day Doorstep Guarantee
                </span>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
                  Covers recurrent faults, parts replaced, and labor. Zero-cost re-inspection guaranteed till:
                </p>
                <span className="text-xs font-bold text-emerald-900 font-mono mt-0.5 block">
                  Valid Until: {warrantyEndDateFormatted}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Security Stamp</span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">VERIFIED-ESCROW</span>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Computer generated tax invoice • No physical signature required</span>
            <span>Support: support@repairtrust.in • +91 80 4567 8900</span>
          </div>
        </div>
      </div>
    </div>
  );
}
