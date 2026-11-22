import React from "react";
import Link from "next/link";
import { ArrowUpRight, Home, Palette, Building2, Hammer } from "lucide-react";
import { BUSINESS_INFO } from "@/constants/business";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IService } from "@/types";

const ICON_MAP = {
  Home,
  Palette,
  Building2,
  Hammer,
};

interface ServicesOverviewProps {
  services?: IService[];
}

export function ServicesOverview({ services }: ServicesOverviewProps) {
  const displayServices =
    services && services.length > 0
      ? services
      : BUSINESS_INFO.services.map((s, idx) => ({
          _id: s.id,
          title: s.title,
          slug: s.slug,
          shortDescription: s.shortDescription,
          icon: s.icon,
          order: idx,
          published: true,
          deliverables: [],
        }));

  return (
    <section className="py-24 bg-stone-900 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <SectionHeader
            eyebrow="Capabilities & Scope"
            title="Comprehensive Civil & Interior Engineering"
            description="From raw plot ground-breaking and RCC framing to bespoke modular woodwork and luxury finishes, we deliver turnkey solutions tailored to Bhopal's modern residences."
            dark
            className="mb-0 max-w-2xl"
          />

          <div className="mt-6 md:mt-0">
            <Link
              href="/services"
              className="inline-flex items-center text-xs tracking-widest uppercase text-amber-400 hover:text-white transition-colors border-b border-amber-400/60 pb-1"
            >
              <span>View All Services</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>

        {/* 4-Column Architectural Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayServices.map((service, index) => {
            const IconComponent =
              ICON_MAP[service.icon as keyof typeof ICON_MAP] || Home;

            return (
              <div
                key={service._id || service.slug}
                className="group relative bg-stone-950/80 border border-stone-800 p-8 flex flex-col justify-between transition-all duration-300 hover:border-amber-400/60 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono text-stone-500">
                      0{index + 1}
                    </span>
                    <div className="p-2.5 bg-stone-900 text-amber-400 group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-light text-stone-100 mb-3 group-hover:text-amber-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-stone-400 font-light leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-8 mt-6 border-t border-stone-900">
                  <Link
                    href={`/services#${service.slug}`}
                    className="inline-flex items-center text-xs tracking-wider uppercase text-stone-400 group-hover:text-white transition-colors"
                  >
                    <span>Explore Specifications</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 text-amber-400" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
