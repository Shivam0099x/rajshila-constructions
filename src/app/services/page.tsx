import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  CheckCircle2,
  ArrowUpRight,
  PlusCircle,
} from "lucide-react";
import { DEMO_IMAGES, DEMO_NOTICE } from "@/constants/demo-data";
import { getServices } from "@/lib/data-fetchers";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Engineering & Interior Services | Scope & Specifications",
  description:
    "Verified construction and interior design services by Rajshila Construction in Bhopal. Residential villas, turnkey interiors, commercial spaces, and civil engineering.",
};

const DEFAULT_IMAGES = [
  DEMO_IMAGES.architecture[2],
  DEMO_IMAGES.interiors.living[0].url,
  DEMO_IMAGES.interiors.commercial[0].url,
  DEMO_IMAGES.interiors.construction[1].url,
];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="bg-stone-950 text-stone-100 pt-28 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-mono block mb-3">
            Capabilities & Deliverables
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
            Verified Services. <br />
            <span className="font-serif-luxury italic text-stone-300">
              Uncompromising Standards.
            </span>
          </h1>
          <p className="mt-6 text-lg text-stone-300 font-light leading-relaxed">
            Every service we offer is backed by seasoned civil supervisors, certified trade specialists, and transparent material schedules. No guesswork, no third-party sub-contracting markups.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 mb-24">
        {services.map((service, index) => {
          const isEven = index % 2 === 1;
          const serviceImage =
            service.coverImage || DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];

          return (
            <div
              key={service._id || service.slug}
              id={service.slug}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 border-t border-stone-800 ${
                isEven ? "lg:grid-flow-dense" : ""
              }`}
            >
              {/* Text & Deliverables (7 cols) */}
              <div
                className={`lg:col-span-7 space-y-6 ${
                  isEven ? "lg:col-start-6" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono text-amber-400 bg-stone-900 border border-stone-800 px-2.5 py-1">
                    0{index + 1}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-stone-400 font-mono">
                    Verified Capability
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                  {service.title}
                </h2>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                  {service.fullDescription || service.shortDescription}
                </p>

                {/* Scope Checklist */}
                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs uppercase tracking-widest text-stone-400 font-mono mb-3">
                      Verified Scope & Specifications
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {service.deliverables.map((item, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-start text-xs text-stone-300 space-x-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="font-light">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="inline-flex items-center text-xs tracking-widest uppercase font-medium text-amber-400 hover:text-white border-b border-amber-400/60 pb-1 transition-colors"
                  >
                    <span>Request Quotation for {service.title}</span>
                    <ArrowUpRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </div>
              </div>

              {/* Visual Presentation (5 cols) */}
              <div
                className={`lg:col-span-5 relative ${
                  isEven ? "lg:col-start-1" : ""
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900 border border-stone-800">
                  <Image
                    src={serviceImage}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-2 text-right text-[11px] text-stone-500 font-mono">
                  {DEMO_NOTICE}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Dynamic Placeholder for Custom Offerings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-stone-900/40 border border-dashed border-stone-800 p-8 sm:p-12 text-center">
          <PlusCircle className="w-8 h-8 text-stone-600 mx-auto mb-3" />
          <h3 className="text-lg font-light text-stone-300 mb-2">
            Bespoke Architectural Engineering Inquiries
          </h3>
          <p className="text-xs text-stone-500 max-w-xl mx-auto leading-relaxed font-mono">
            Looking for a specialized civil scope such as cantilevered swimming pool engineering, deep borehole waterproofing, or smart home solar integration? Contact our Bhopal engineering office directly.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 border border-stone-800 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-light text-stone-100">
              Need a Customized BOQ for Your Site?
            </h3>
            <p className="text-xs text-stone-400 mt-1 font-light">
              We provide itemized estimates based on your plot dimensions and architectural expectations.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 text-xs tracking-widest uppercase font-medium transition-colors"
          >
            <span>Request Site Estimate</span>
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
