import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ALL_SERVICE_SLUGS,
  getServiceBySlug,
  POPULAR_SERVICES,
} from "@/data/servicesData";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_SERVICE_SLUGS.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found — RepairTrust",
      description: "The requested repair service was not found on RepairTrust.",
    };
  }

  return {
    title: `${service.name} in Bengaluru — Transparent Quotes & Doorstep Repair | RepairTrust`,
    description: service.heroSubtitle,
    keywords: [
      `${service.name.toLowerCase()} Bangalore`,
      `${service.name.toLowerCase()} Bengaluru`,
      `doorstep ${service.name.toLowerCase()}`,
      `verified ${service.name.toLowerCase()} technicians`,
      "transparent repair quotes Bangalore",
      ...service.supportedBrands.map((b) => `${b} ${service.name.toLowerCase()}`),
    ],
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailView service={service} />;
}
