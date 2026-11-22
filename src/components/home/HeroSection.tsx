import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, ShieldCheck, Compass } from "lucide-react";
import { BUSINESS_INFO } from "@/constants/business";
import { DEMO_IMAGES, DEMO_NOTICE } from "@/constants/demo-data";
import { IBusinessSettings } from "@/types";

interface HeroSectionProps {
  settings?: IBusinessSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const heroImage = DEMO_IMAGES.hero[0].url;
  const description = settings?.heroDescription || settings?.shortDescription || BUSINESS_INFO.description;
  const ctaText = settings?.heroCtaText || "Explore Projects";

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center bg-stone-950 overflow-hidden pt-20">
      {/* Background Architectural Visual with Subtle Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Rajshila Construction Architecture Showcase"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-35 scale-[1.02] transform transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.7)_100%)]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center sm:text-left">
        <div className="max-w-3xl">
          {/* Location & Status Badge */}
          <div className="inline-flex items-center space-x-2 bg-stone-900/90 border border-stone-800 text-stone-300 px-3.5 py-1.5 text-xs font-mono uppercase tracking-widest mb-8 backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Ayodhya Bypass • Bhopal, Madhya Pradesh</span>
          </div>

          {/* Main Architectural Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1] mb-6">
            Structural Integrity. <br />
            <span className="font-serif-luxury italic text-stone-200">
              Bespoke Architecture.
            </span>
          </h1>

          {/* Business Description */}
          <p className="text-base sm:text-lg md:text-xl text-stone-300 font-light leading-relaxed mb-10 max-w-2xl">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 font-medium text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 shadow-lg"
            >
              <span>{ctaText}</span>
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent hover:bg-white/10 text-stone-200 hover:text-white border border-stone-700 hover:border-stone-400 font-medium text-xs sm:text-sm tracking-widest uppercase transition-all duration-200"
            >
              <span>Request a Quote</span>
            </Link>
          </div>

          {/* Architectural Pillars / Features */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-6 text-left">
            <div>
              <div className="flex items-center text-xs uppercase tracking-wider text-amber-400 font-mono mb-1">
                <Compass className="w-3.5 h-3.5 mr-1.5" />
                <span>Civil & Structural</span>
              </div>
              <p className="text-xs text-stone-400 font-light">
                High-standard RCC & masonry execution
              </p>
            </div>

            <div>
              <div className="flex items-center text-xs uppercase tracking-wider text-amber-400 font-mono mb-1">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                <span>Turnkey Interiors</span>
              </div>
              <p className="text-xs text-stone-400 font-light">
                Modular woodwork & luxury finishing
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center text-xs uppercase tracking-wider text-amber-400 font-mono mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />
                <span>Timeline Fidelity</span>
              </div>
              <p className="text-xs text-stone-400 font-light">
                Documented milestone tracking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Demo Notice */}
      <div className="absolute bottom-3 right-4 z-10 hidden sm:block">
        <span className="text-[10px] text-stone-500 bg-black/60 px-2.5 py-1 font-mono tracking-wider backdrop-blur-xs">
          {DEMO_NOTICE}
        </span>
      </div>
    </section>
  );
}
