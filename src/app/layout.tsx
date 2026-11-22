import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { BUSINESS_INFO } from "@/constants/business";

export const metadata: Metadata = {
  metadataBase: new URL("https://rajshilaconstruction.com"),
  title: {
    default: `${BUSINESS_INFO.name} | Architectural Construction & Interiors Bhopal`,
    template: `%s | ${BUSINESS_INFO.name}`,
  },
  description:
    "Premier residential building contractor and interior design firm in Bhopal, Madhya Pradesh. Specializing in luxury villas, structural civil engineering, and turnkey bespoke interior fit-outs.",
  keywords: [
    "Rajshila Construction Bhopal",
    "Construction company Bhopal",
    "Interior design Bhopal",
    "Civil contractor Ayodhya Bypass Bhopal",
    "Residential builders Bhopal",
    "Turnkey interior fitouts MP",
    "Architectural construction Bhopal",
  ],
  authors: [{ name: BUSINESS_INFO.name }],
  creator: BUSINESS_INFO.name,
  publisher: BUSINESS_INFO.name,
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${BUSINESS_INFO.name} | Architectural Construction & Interiors Bhopal`,
    description:
      "Premier residential building contractor and interior design firm in Bhopal, Madhya Pradesh. Ground-up civil construction, structural engineering, and bespoke turnkey interior design.",
    url: "https://rajshilaconstruction.com",
    siteName: BUSINESS_INFO.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: `${BUSINESS_INFO.name} Architectural Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS_INFO.name} | Architectural Construction Bhopal`,
    description:
      "Bespoke residential civil construction and turnkey interior design in Bhopal, MP.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAF9] text-[#1C1917] antialiased selection:bg-stone-900 selection:text-stone-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
