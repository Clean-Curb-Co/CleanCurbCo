import type { Metadata } from "next";
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cleancurbco.com"),
  title: {
    default: "Clean Curb Co. | Garbage Bin Cleaning in Cane Bay, SC",
    template: "%s | Clean Curb Co.",
  },
  description:
    "Professional garbage bin cleaning, sanitizing, and deodorizing for Cane Bay and nearby Summerville communities. Locally owned, veteran-owned, eco-conscious service.",
  keywords: [
    "Garbage bin cleaning Cane Bay",
    "Trash can cleaning Summerville SC",
    "Bin cleaning Cane Bay",
    "Residential bin cleaning",
    "Trash bin sanitizing",
    "Curbside bin cleaning",
  ],
  openGraph: {
    title: "Clean Curb Co. | Garbage Bin Cleaning in Cane Bay, SC",
    description:
      "Fresh starts at the curb for Cane Bay and nearby Summerville communities.",
    url: "/",
    siteName: "Clean Curb Co.",
    images: [
      {
        url: "/clean-curb-hero.png",
        width: 1792,
        height: 1024,
        alt: "Clean garbage bins being washed at the curb.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clean Curb Co. | Fresh starts at the curb",
    description:
      "Professional garbage bin cleaning for Cane Bay and nearby Summerville communities.",
    images: ["/clean-curb-hero.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
