import React from "react";
import { Metadata } from "next";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  MessageSquare,
  Compass,
} from "lucide-react";
import { BUSINESS_INFO } from "@/constants/business";
import { getBusinessSettings } from "@/lib/data-fetchers";
import { ContactForm } from "@/components/contact/ContactForm";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact & Project Consultation | Ayodhya Bypass Bhopal",
  description:
    "Contact Rajshila Construction in Bhopal. Office address, phone number +91 81095 15701, WhatsApp consultation, and project enquiry form.",
};

export default async function ContactPage() {
  const settings = await getBusinessSettings();
  return (
    <div className="bg-stone-950 text-stone-100 pt-28 pb-24 min-h-screen">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-mono block mb-3">
            Direct Consultation
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
            Connect With Our <br />
            <span className="font-serif-luxury italic text-stone-300">
              Engineering Team.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-400 font-light leading-relaxed">
            Whether you are breaking ground on a new plot or planning a turnkey interior transformation in Bhopal, our lead engineers are available to review your architectural requirements.
          </p>
        </div>
      </section>

      {/* Main Grid: Form (7 cols) + Verified Details & Map (5 cols) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Business Information & Location Details */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Contact Box */}
            <div className="bg-stone-900 border border-stone-800 p-8 space-y-6">
              <h3 className="text-xs uppercase tracking-widest text-amber-400 font-mono">
                Verified Office Information
              </h3>

              <div className="space-y-4 text-sm text-stone-300">
                {/* Physical Address */}
                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-stone-500 font-mono block">
                      Physical Address
                    </span>
                    <span className="leading-snug text-stone-200">
                      {settings.address || BUSINESS_INFO.location.street},{" "}
                      {settings.city || "Bhopal"}, {settings.state || "MP"}{" "}
                      {settings.postalCode || "462022"}
                    </span>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start space-x-3.5">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-stone-500 font-mono block">
                      Direct Phone
                    </span>
                    <a
                      href={`tel:${settings.phone || BUSINESS_INFO.contact.phoneClean}`}
                      className="text-stone-200 hover:text-amber-400 transition-colors font-medium text-base"
                    >
                      {settings.phoneDisplay || settings.phone || BUSINESS_INFO.contact.phoneDisplay}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start space-x-3.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-stone-500 font-mono block">
                      WhatsApp Quick Channel
                    </span>
                    <a
                      href={settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : BUSINESS_INFO.contact.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center text-sm"
                    >
                      <span>Direct Chat on WhatsApp</span>
                      <ExternalLink className="w-3 h-3 ml-1.5" />
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3.5">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-stone-500 font-mono block">
                      Inquiry Email
                    </span>
                    <a
                      href={`mailto:${settings.email || BUSINESS_INFO.contact.email}`}
                      className="text-stone-300 hover:text-white transition-colors text-xs font-mono"
                    >
                      {settings.email || BUSINESS_INFO.contact.email}
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start space-x-3.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-stone-500 font-mono block">
                      Business Hours
                    </span>
                    <span className="text-stone-300">
                      {settings.openingHours || BUSINESS_INFO.hours.display}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Maps Action */}
              <div className="pt-4 border-t border-stone-800">
                <a
                  href={BUSINESS_INFO.maps.listingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-3 bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-amber-400 text-stone-200 text-xs uppercase tracking-widest font-mono transition-colors"
                >
                  <Compass className="w-3.5 h-3.5 mr-2 text-amber-400" />
                  <span>Open in Google Maps Application</span>
                  <ExternalLink className="w-3 h-3 ml-2 text-stone-400" />
                </a>
              </div>
            </div>

            {/* Google Maps Embed / Interactive Pin */}
            <div className="bg-stone-900 border border-stone-800 overflow-hidden">
              <div className="p-4 border-b border-stone-800 flex items-center justify-between text-xs font-mono text-stone-400">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                  Bhopal Location Coordinates
                </span>
                <span className="text-stone-500">23.2758° N, 77.4589° E</span>
              </div>

              <div className="relative aspect-[16/10] w-full bg-stone-950">
                <iframe
                  title="Rajshila Construction Office Map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    "Rajshila Construction, Near Tanatan Dhaba, Ayodhya Bypass, Bhopal, Madhya Pradesh 462022"
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0 filter grayscale invert contrast-125 opacity-85 hover:filter-none transition-all duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              <div className="p-3 bg-stone-950 text-center border-t border-stone-800">
                <a
                  href={BUSINESS_INFO.maps.listingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-amber-400 hover:text-white underline inline-flex items-center"
                >
                  <span>Launch Google Maps GPS Navigation</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
