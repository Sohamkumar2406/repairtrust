import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RepairTrust — Verified Doorstep Repairs Bengaluru",
    short_name: "RepairTrust",
    description:
      "Find verified repair professionals, compare transparent quotations and get repairs completed with a 60-day warranty in Bengaluru.",
    start_url: "/",
    display: "standalone",
    background_color: "#101828",
    theme_color: "#101828",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
