import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Manden Vietnam",
    short_name: "Manden",
    description: "Medium and long-term homes for expats in Vietnam.",
    start_url: "/",
    display: "standalone",
    background_color: "#ededed",
    theme_color: "#ededed",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
