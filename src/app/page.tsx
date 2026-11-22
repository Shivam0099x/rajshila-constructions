import React from "react";
import Link from "next/link";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { OngoingProjectsPreview } from "@/components/home/OngoingProjectsPreview";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { GoogleReviewsSection } from "@/components/home/GoogleReviewsSection";
import {
  getProjects,
  getServices,
  getBusinessSettings,
} from "@/lib/data-fetchers";
import { getGooglePlacesData } from "@/lib/google-places";
import { BUSINESS_INFO } from "@/constants/business";

export const revalidate = 3600; // Revalidate page every hour

export default async function HomePage() {
  const [allProjects, placesData, services, settings] = await Promise.all([
    getProjects(),
    getGooglePlacesData(),
    getServices(),
    getBusinessSettings(),
  ]);

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection settings={settings} />

      {/* 2. About Preview */}
      <AboutPreview />

      {/* 3. Services Overview */}
      <ServicesOverview services={services} />

      {/* 4. Featured Completed Projects */}
      <FeaturedProjects projects={allProjects} />

      {/* 5. Ongoing Interior & Construction Projects */}
      <OngoingProjectsPreview projects={allProjects} />

      {/* 6. Visual Interior Gallery Preview */}
      <GalleryPreview />

      {/* 7. Why Choose Us */}
      <WhyChooseUs />

      {/* 8. Google Reviews Section (Google Places API New) */}
      <GoogleReviewsSection placesData={placesData} />

      {/* 9. High-Impact Contact CTA Banner */}
      <section className="py-20 bg-[#1C1917] text-stone-100 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-900 border border-stone-800 p-8 sm:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 block mb-2">
                Initiate Your Vision
              </span>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white leading-tight">
                Ready to engineer your home or interior space in Bhopal?
              </h2>
              <p className="mt-4 text-stone-400 text-sm sm:text-base font-light leading-relaxed">
                Schedule a site consultation or discuss structural estimates with our engineering leads at our Ayodhya Bypass office.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <a
                href={settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : BUSINESS_INFO.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-4 bg-stone-950 hover:bg-black text-stone-200 border border-stone-700 hover:border-amber-400 text-xs uppercase tracking-widest transition-colors font-medium"
              >
                <MessageSquare className="w-4 h-4 mr-2 text-emerald-400" />
                <span>WhatsApp Us</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 font-medium text-xs uppercase tracking-widest transition-colors shadow-lg"
              >
                <span>Request Quotation</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
