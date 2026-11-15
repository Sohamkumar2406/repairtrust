"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServiceCategories } from "@/components/ServiceCategories";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyRepairTrust } from "@/components/WhyRepairTrust";
import { TrustSection } from "@/components/TrustSection";
import { TechnicianCTA } from "@/components/TechnicianCTA";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

import { BookingModal } from "@/components/modals/BookingModal";
import { TechnicianModal } from "@/components/modals/TechnicianModal";
import { AuthModal } from "@/components/modals/AuthModal";

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<string>("Koramangala");

  // Modal States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string>("ac-repair");
  const [bookingIssue, setBookingIssue] = useState<string>("");

  const [isTechnicianOpen, setIsTechnicianOpen] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<"customer" | "technician">("customer");

  // Handlers
  const handleOpenBooking = (serviceId?: string, issue?: string) => {
    if (serviceId) setBookingServiceId(serviceId);
    if (issue) setBookingIssue(issue);
    setIsBookingOpen(true);
  };

  const handleHeroSearch = (serviceId: string, issue: string, location: string) => {
    setBookingServiceId(serviceId);
    setBookingIssue(issue);
    setSelectedLocation(location);
    setIsBookingOpen(true);
  };

  const handleOpenTechnician = () => {
    setIsTechnicianOpen(true);
  };

  const handleOpenAuth = (role: "customer" | "technician" = "customer") => {
    setAuthRole(role);
    setIsAuthOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* 1. Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenTechnician={handleOpenTechnician}
        onOpenAuth={handleOpenAuth}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection
          onSearch={handleHeroSearch}
          onOpenTechnician={handleOpenTechnician}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
        />

        {/* 3. Popular Repair Categories */}
        <ServiceCategories onSelectService={handleOpenBooking} />

        {/* 4. How It Works */}
        <HowItWorks
          onStartBooking={() => handleOpenBooking()}
          onOpenTechnician={handleOpenTechnician}
        />

        {/* 5. Why RepairTrust */}
        <WhyRepairTrust onLearnMore={() => {}} />

        {/* 6. Customer Trust Section (Verification & Protection) */}
        <TrustSection />

        {/* 7. Technician Section */}
        <TechnicianCTA onOpenTechnicianModal={handleOpenTechnician} />

        {/* 8. FAQ Section */}
        <FAQ />
      </main>

      {/* 9. Footer */}
      <Footer
        onOpenBooking={handleOpenBooking}
        onOpenTechnician={handleOpenTechnician}
        onSelectLocation={setSelectedLocation}
      />

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setBookingIssue("");
        }}
        preselectedServiceId={bookingServiceId}
        prefilledIssue={bookingIssue}
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
    </div>
  );
}
