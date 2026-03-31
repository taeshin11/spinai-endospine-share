import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EndoSpine Share — Spinal Endoscopy Video Platform",
    template: "%s | EndoSpine Share",
  },
  description:
    "The global platform for spine endoscopy education. Share, discover, and learn from spinal endoscopy surgical videos with verified medical professionals.",
  keywords: [
    "spinal endoscopy",
    "endoscopic spine surgery",
    "PELD",
    "surgical video sharing",
    "spine surgery education",
    "endoscopic discectomy",
    "spine surgery techniques",
  ],
  authors: [{ name: "SPINAI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "EndoSpine Share",
    title: "EndoSpine Share — The Global Platform for Spine Endoscopy Education",
    description:
      "Share, discover, and learn from spinal endoscopy surgical videos with verified medical professionals worldwide.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "EndoSpine Share - Spinal Endoscopy Video Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EndoSpine Share — Spine Endoscopy Video Platform",
    description:
      "The global platform for spine endoscopy education and surgical video sharing.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalOrganization",
              name: "EndoSpine Share",
              description:
                "A secure video sharing platform for spine endoscopy surgeons",
              url: process.env.NEXT_PUBLIC_SITE_URL,
              medicalSpecialty: "Surgical",
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F8F9FA] font-[family-name:var(--font-dm-sans)] text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
