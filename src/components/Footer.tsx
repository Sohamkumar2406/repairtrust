"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  ArrowRight,
  Heart,
  Lock,
  FileCheck2,
} from "lucide-react";
import { BENGALURU_LOCATIONS } from "@/data/bengaluruLocations";
import { POPULAR_SERVICES } from "@/data/servicesData";

interface FooterProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenTechnician: () => void;
  onSelectLocation: (loc: string) => void;
}

export function Footer({
  onOpenBooking,
  onOpenTechnician,
  onSelectLocation,
}: FooterProps) {
  return (
    <footer className="bg-[#101828] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: Company Information */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Repair<span className="text-emerald-400">Trust</span>
                </span>
                <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                  Find • Compare • Repair • Trust
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              RepairTrust is Bengaluru&apos;s verified doorstep home appliance and electronics repair platform. We eliminate price ambiguity through transparent quotations, background-checked specialists, and digital warranty records.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Indiqube Gamma, 4th Floor, Outer Ring Road, Kadubeesanahalli, Bengaluru, Karnataka 560103
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:08048209800" className="hover:text-emerald-400 transition-colors">
                  080-4820-9800 (Customer Support)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:support@repairtrust.in" className="hover:text-emerald-400 transition-colors">
                  support@repairtrust.in
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Operating Hours: 8:00 AM – 9:00 PM IST (Mon – Sun)</span>
              </div>
            </div>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Repair Services
            </h4>
            <ul className="space-y-2 text-xs">
              {POPULAR_SERVICES.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="hover:text-emerald-400 text-slate-400 transition-colors block"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/services"
                  className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                >
                  View All Services &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: For Technicians & Support */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Technicians & Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenTechnician}
                  className="hover:text-emerald-400 text-emerald-400 font-semibold transition-colors flex items-center gap-1 text-left"
                >
                  Join as a Technician &rarr;
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTechnician}
                  className="hover:text-white transition-colors text-left"
                >
                  Technician Guidelines
                </button>
              </li>
              <li>
                <a href="tel:08048209801" className="hover:text-white transition-colors">
                  Partner Helpdesk (080-4820-9801)
                </a>
              </li>
              <li>
                <Link href="#faq" className="hover:text-white transition-colors">
                  Help Center & FAQ
                </Link>
              </li>
              <li>
                <Link href="#trust-guarantee" className="hover:text-white transition-colors">
                  Customer Protection Charter
                </Link>
              </li>
              <li>
                <Link href="#trust-guarantee" className="hover:text-white transition-colors">
                  Service Warranty Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Trust */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Terms & Conditions
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Technician Code of Conduct
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Dispute Resolution Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Fair Price Guarantee
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Bengaluru Service Pincodes
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bengaluru Coverage Localities Bar */}
        <div className="py-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bengaluru Neighborhoods Served</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {BENGALURU_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => onSelectLocation(loc.name)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 hover:text-emerald-400 text-slate-400 border border-slate-700/60 transition-colors"
              >
                {loc.name} ({loc.pincode})
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 RepairTrust Technologies Pvt. Ltd. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              256-Bit SSL Encrypted
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <FileCheck2 className="w-3 h-3 text-emerald-400" />
              ISO 9001 Certified Quality Standard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
