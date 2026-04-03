import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aile Panosu",
    short_name: "Aile Panosu",
    description: "Tablet odaklı aile görev yönetimi",
    display: "standalone",
    orientation: "landscape",
    background_color: "#f4efe8",
    theme_color: "#0f172a",
    lang: "tr",
    start_url: "/"
  };
}
