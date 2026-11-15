"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  ChevronDown,
  Menu,
  X,
  PhoneCall,
  User,
  Wrench,
  Sparkles,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { BENGALURU_LOCATIONS, BengaluruLocation } from "@/data/bengaluruLocations";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenTechnician: () => void;
  onOpenAuth: (role?: "customer" | "technician") => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
}

export function Navbar({
  onOpenBooking,
  onOpenTechnician,
  onOpenAuth,
  selectedLocation,
  onSelectLocation,
}: NavbarProps) {
  const { user, profile, signOut, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80"
            : "bg-white border-b border-slate-100"
        }`}
      >
        {/* Top Bengaluru Utility Bar */}
        <div className="bg-[#101828] text-slate-300 text-xs py-1.5 px-4 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Bengaluru Doorstep Repairs Active
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">
                100% Background-Checked Technicians & 30-90 Day Service Warranty
              </span>
            </div>

            <div className="flex items-center gap-5 text-xs text-slate-300">
              <button
                onClick={() => onOpenAuth("technician")}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <Wrench className="w-3.5 h-3.5" />
                Technician Partner Login
              </button>
              <a
                href="tel:08048209800"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-medium"
              >
                <PhoneCall className="w-3 h-3 text-emerald-400" />
                Support: 080-4820-9800
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#101828] to-[#1E293B] border border-slate-700/50 flex items-center justify-center text-emerald-400 shadow-sm group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-xl tracking-tight text-[#101828]">
                      Repair<span className="text-emerald-500">Trust</span>
                    </span>
                  </div>
                  <span className="hidden sm:block text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                    Find • Compare • Repair • Trust
                  </span>
                </div>
              </Link>

              {/* Bengaluru Location Selector Pill */}
              <div className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-xs font-medium text-slate-800 transition-colors border border-slate-200"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{selectedLocation || "Select Bengaluru Area"}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {locationDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setLocationDropdownOpen(false)}
                    />
                    <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-30 max-h-72 overflow-y-auto">
                      <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Bengaluru Hubs
                      </div>
                      {BENGALURU_LOCATIONS.map((loc) => (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => {
                            onSelectLocation(loc.name);
                            setLocationDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                            selectedLocation === loc.name
                              ? "font-semibold text-emerald-700 bg-emerald-50/50"
                              : "text-slate-700"
                          }`}
                        >
                          <span>{loc.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {loc.pincode}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-700">
              <Link
                href="/"
                className="hover:text-emerald-600 transition-colors py-1"
              >
                Home
              </Link>
              <Link
                href="/services"
                className="hover:text-emerald-600 transition-colors py-1"
              >
                Services
              </Link>
              <Link
                href="/#how-it-works"
                className="hover:text-emerald-600 transition-colors py-1"
              >
                How It Works
              </Link>
              <Link
                href="/#why-repairtrust"
                className="hover:text-emerald-600 transition-colors py-1"
              >
                Why Us
              </Link>
              <button
                type="button"
                onClick={onOpenTechnician}
                className="hover:text-emerald-600 transition-colors py-1 text-left cursor-pointer"
              >
                Become a Technician
              </button>
              <Link
                href="/#faq"
                className="hover:text-emerald-600 transition-colors py-1"
              >
                Help
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {profile?.full_name
                        ? profile.full_name.charAt(0).toUpperCase()
                        : user?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {profile?.full_name || user?.email?.split("@")[0] || "My Account"}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold capitalize">
                        {profile?.role === "technician" ? "Technician Partner" : "Customer"}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {userDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-40">
                        <div className="px-4 py-2.5 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {profile?.full_name || "RepairTrust User"}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                            {profile?.role === "technician" ? "Verified Technician" : "Verified Customer"}
                          </span>
                        </div>

                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            My Bookings & Quotes
                          </Link>
                          <Link
                            href="/technician"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Wrench className="w-4 h-4 text-emerald-600" />
                            Technician Jobs Portal
                          </Link>
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
                          >
                            <ShieldCheck className="w-4 h-4 text-indigo-600" />
                            Admin Console
                          </Link>
                        </div>

                        <div className="pt-1 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={async () => {
                              setUserDropdownOpen(false);
                              await signOut();
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left"
                          >
                            <LogOut className="w-4 h-4 text-red-500" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onOpenAuth("customer")}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-100"
                >
                  Login
                </button>
              )}

              <button
                onClick={onOpenBooking}
                className="px-4.5 py-2 bg-[#101828] hover:bg-[#1E293B] text-white text-sm font-medium rounded-xl shadow-sm transition-all duration-150 flex items-center gap-1.5 hover:shadow"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onOpenBooking}
                className="px-3 py-1.5 bg-[#101828] text-white text-xs font-medium rounded-lg"
              >
                Book
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#101828] flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-bold text-base text-[#101828]">RepairTrust</span>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Location Selector */}
            <div className="mb-5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Your Bengaluru Area
              </span>
              <select
                value={selectedLocation}
                onChange={(e) => onSelectLocation(e.target.value)}
                className="w-full text-xs font-semibold text-slate-900 bg-transparent border-0 focus:ring-0 p-0"
              >
                {BENGALURU_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} ({loc.pincode})
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col gap-3 font-medium text-slate-800 text-sm mb-6">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="py-2 px-3 rounded-lg hover:bg-slate-50"
              >
                Home
              </Link>
              <Link
                href="/services"
                onClick={closeMobileMenu}
                className="py-2 px-3 rounded-lg hover:bg-slate-50"
              >
                Services
              </Link>
              <Link
                href="/#how-it-works"
                onClick={closeMobileMenu}
                className="py-2 px-3 rounded-lg hover:bg-slate-50"
              >
                How It Works
              </Link>
              <Link
                href="/#why-repairtrust"
                onClick={closeMobileMenu}
                className="py-2 px-3 rounded-lg hover:bg-slate-50"
              >
                Why RepairTrust
              </Link>
              <button
                onClick={() => {
                  closeMobileMenu();
                  onOpenTechnician();
                }}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 text-left font-medium text-emerald-700 cursor-pointer"
              >
                Become a Technician
              </button>
              <Link
                href="/#faq"
                onClick={closeMobileMenu}
                className="py-2 px-3 rounded-lg hover:bg-slate-50"
              >
                Help & FAQ
              </Link>
            </div>

            {/* Mobile Action Buttons */}
            <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  closeMobileMenu();
                  onOpenBooking();
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl text-center shadow-sm"
              >
                Get Started / Book Service
              </button>
              {isAuthenticated ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {profile?.full_name || "My Account"}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-1">
                    <Link
                      href="/dashboard"
                      onClick={closeMobileMenu}
                      className="text-center py-1.5 px-2 bg-white rounded-lg border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Bookings
                    </Link>
                    <Link
                      href="/technician"
                      onClick={closeMobileMenu}
                      className="text-center py-1.5 px-2 bg-white rounded-lg border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Technician
                    </Link>
                    <Link
                      href="/admin"
                      onClick={closeMobileMenu}
                      className="text-center py-1.5 px-2 bg-white rounded-lg border border-indigo-200 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-50"
                    >
                      Admin
                    </Link>
                  </div>
                  <button
                    onClick={async () => {
                      closeMobileMenu();
                      await signOut();
                    }}
                    className="w-full py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    closeMobileMenu();
                    onOpenAuth("customer");
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm rounded-xl text-center"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
