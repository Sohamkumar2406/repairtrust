import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://repairtrust.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RepairTrust — Repairs Made Simple. Trust Made Certain.",
    template: "%s | RepairTrust Bengaluru",
  },
  description:
    "Find verified repair professionals, compare transparent quotations and get everyday repairs done with a 60-day doorstep warranty in Bengaluru.",
  keywords: [
    "appliance repair Bengaluru",
    "AC repair Bangalore",
    "laptop repair Koramangala",
    "verified technicians Bangalore",
    "washing machine repair Indiranagar",
    "refrigerator repair HSR Layout",
    "transparent repair quotes",
    "doorstep electronics service Bengaluru",
  ],
  authors: [{ name: "RepairTrust Technologies India Pvt Ltd" }],
  creator: "RepairTrust Technologies India Pvt Ltd",
  publisher: "RepairTrust Technologies India Pvt Ltd",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: "RepairTrust — Repairs Made Simple. Trust Made Certain.",
    description:
      "Find verified repair professionals, compare transparent quotations and get repairs completed with a 60-day warranty in Bengaluru.",
    siteName: "RepairTrust",
  },
  twitter: {
    card: "summary_large_image",
    title: "RepairTrust — Verified Doorstep Repairs Bengaluru",
    description:
      "Find verified technicians, compare upfront quotations, and get 60-day doorstep warranty in Bengaluru.",
    creator: "@repairtrust_in",
  },
  alternates: {
    canonical: siteUrl,
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru",
    "geo.position": "12.9716;77.5946",
    ICBM: "12.9716, 77.5946",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#101828",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "RepairTrust Technologies India Private Limited",
  url: siteUrl,
  description:
    "Verified doorstep appliance and electronics repair marketplace in Bengaluru with upfront quotations and 60-day warranty.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "80 Feet Road, 4th Block, Koramangala",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560034",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 12.9352,
    longitude: 77.6245,
  },
  areaServed: [
    "Koramangala",
    "Indiranagar",
    "HSR Layout",
    "Whitefield",
    "Bellandur",
    "Jayanagar",
    "JP Nagar",
    "BTM Layout",
    "Marathahalli",
    "Electronic City",
  ],
  priceRange: "₹199 - ₹2500",
  telephone: "+91-80-4567-8900",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-[#10B981]/20 selection:text-[#101828]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
