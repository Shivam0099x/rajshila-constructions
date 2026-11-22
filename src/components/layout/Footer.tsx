import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Mail,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { BUSINESS_INFO } from "@/constants/business";
import { getBusinessSettings } from "@/lib/data-fetchers";

export async function Footer() {
  const settings = await getBusinessSettings();
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      {/* Top Footer Architectural Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Column 1: Brand & Philosophy (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-2xl font-light tracking-[0.25em] uppercase text-white block">
                RAJSHILA
              </span>
              <span className="text-[11px] tracking-[0.3em] uppercase text-amber-400 font-mono mt-1 block">
                CONSTRUCTION & INTERIOR ARCHITECTURE
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-md font-light">
              Specialized in high-end residential engineering, civil construction, and bespoke turnkey interior design in Bhopal, Madhya Pradesh. Driven by structural integrity, transparent delivery, and timeless architectural craftsmanship.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <span className="inline-flex items-center text-xs text-stone-400 bg-stone-900 border border-stone-800 px-3 py-1.5 font-mono">
                <Compass className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                Bhopal, MP
              </span>
              <span className="inline-flex items-center text-xs text-stone-400 bg-stone-900 border border-stone-800 px-3 py-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Civil & Interior Turnkey
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-white font-medium">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Completed Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/ongoing-projects"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Ongoing Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Interior Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Contact & Inquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-white font-medium">
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>Residential Construction</li>
              <li>Turnkey Interiors</li>
              <li>Civil Engineering</li>
              <li>Modular Kitchens</li>
              <li>Living Room Design</li>
              <li>Commercial Spaces</li>
              <li>Structural Remodeling</li>
            </ul>
          </div>

          {/* Column 4: Verified Location & Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-white font-medium">
              Bhopal Office
            </h4>
            <div className="space-y-3.5 text-sm text-stone-400">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {settings.address || BUSINESS_INFO.location.street},{" "}
                  {settings.city || "Bhopal"}, {settings.state || "MP"}{" "}
                  {settings.postalCode || "462022"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`tel:${settings.phone || BUSINESS_INFO.contact.phoneClean}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.phoneDisplay || settings.phone || BUSINESS_INFO.contact.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`mailto:${settings.email || BUSINESS_INFO.contact.email}`}
                  className="hover:text-white transition-colors text-xs"
                >
                  {settings.email || BUSINESS_INFO.contact.email}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.openingHours || BUSINESS_INFO.hours.display}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={settings.googleMapsUrl || BUSINESS_INFO.maps.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs tracking-wider uppercase text-amber-300 hover:text-white transition-colors border-b border-amber-400/50 pb-0.5"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3 ml-1.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-900 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 font-mono space-y-3 md:space-y-0">
          <div>
            © {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.
          </div>
          <div className="text-center md:text-right text-[11px] text-stone-500">
            Phase 1 Foundation • Authentic Business Reference Bhopal
          </div>
        </div>
      </div>
    </footer>
  );
}
