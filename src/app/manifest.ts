import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clean Curb Co.",
    short_name: "Clean Curb",
    description: "Clean Curb Co. field and customer operations.",
    start_url: "/field/today",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#00ff38",
    icons: [
      {
        src: "/icon.png",
        sizes: "1024x1024",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
