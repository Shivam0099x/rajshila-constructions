import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { BUSINESS_INFO } from "@/constants/business";
import { DEMO_IMAGES, DEMO_NOTICE } from "@/constants/demo-data";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us | Architectural Construction & Design Philosophy",
  description:
    "Learn about Rajshila Construction, our civil engineering rigor, turnkey interior philosophy, and commitment to structural integrity in Bhopal, Madhya Pradesh.",
};

export default function AboutPage() {
  return (
    <div className="bg-stone-950 text-stone-100 pt-28 pb-24">
      {/* Page Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-mono block mb-3">
            Company Profile & Heritage
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
            Building with permanent value. <br />
            <span className="font-serif-luxury italic text-stone-300">
              Rooted in Bhopal.
            </span>
          </h1>
          <p className="mt-6 text-lg text-stone-300 font-light leading-relaxed">
            Rajshila Construction was established to redefine how residential construction and turnkey interior spaces are realized in Bhopal, Madhya Pradesh. By unifying structural engineering discipline with bespoke interior detailing, we deliver projects built to endure generations.
          </p>
        </div>
      </section>

      {/* Narrative & Visual Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-light text-stone-100">
              The Convergence of Engineering Rigor and Aesthetic Restraint
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
              Too often in contemporary building, a sharp disconnect exists between the civil contractor pouring concrete and the interior designer furnishing rooms. This results in compromised load paths, unplanned beam drops, awkwardly placed conduits, and inflated change-orders.
            </p>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
              At Rajshila Construction, our philosophy centers on integrated project ownership. From soil excavation at Ayodhya Bypass or Arera Colony through the installation of custom Italian marble and concealed HVAC ducting, our engineering team manages the complete lifecycle under a single contract.
            </p>

            <div className="pt-4 border-t border-stone-800">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-amber-400 block">
                    Headquarters
                  </span>
                  <span className="text-sm text-stone-200 mt-1 block">
                    Ayodhya Bypass, Bhopal
                  </span>
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-amber-400 block">
                    Primary Domain
                  </span>
                  <span className="text-sm text-stone-200 mt-1 block">
                    Residential Civil & Turnkey Interiors
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900 border border-stone-800">
              <Image
                src={DEMO_IMAGES.architecture[0]}
                alt="Rajshila Construction Architecture"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-right text-[11px] text-stone-500 font-mono">
              {DEMO_NOTICE}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-stone-900 border-y border-stone-800 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Operating Principles"
            title="Core Values That Govern Every Site"
            description="Our fundamental commitments that ensure transparency, safety, and architectural excellence for our clients in Central India."
            dark
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {BUSINESS_INFO.coreValues.map((val, idx) => (
              <div
                key={idx}
                className="bg-stone-950 p-6 border border-stone-800 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono text-amber-400 block mb-4">
                    0{idx + 1}
                  </span>
                  <h3 className="text-lg font-light text-stone-100 mb-2">
                    {val.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-light leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Phase Delivery Approach */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <SectionHeader
          eyebrow="Execution Methodology"
          title="From Blueprint to Turnkey Handover"
          description="A structured four-stage methodology engineered to eliminate unexpected budget shifts and deliver on agreed milestones."
          dark
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {/* Stage 1 */}
          <div className="border-l-2 border-amber-400 pl-6 space-y-3">
            <span className="text-xs font-mono uppercase text-amber-400">
              Stage 01
            </span>
            <h3 className="text-lg font-light text-stone-100">
              Consultation & Soil Assessment
            </h3>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Evaluating plot topography, bearing capacity, client spatial briefs, and municipal setback requirements.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="border-l-2 border-stone-700 pl-6 space-y-3">
            <span className="text-xs font-mono uppercase text-stone-400">
              Stage 02
            </span>
            <h3 className="text-lg font-light text-stone-100">
              Architectural BOQ & 3D Drafting
            </h3>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Developing structural drawings, MEP layouts, material schedules, and an itemized fixed-price BOQ.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="border-l-2 border-stone-700 pl-6 space-y-3">
            <span className="text-xs font-mono uppercase text-stone-400">
              Stage 03
            </span>
            <h3 className="text-lg font-light text-stone-100">
              Civil Execution & Quality Audits
            </h3>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Grade-M30 concrete casting, rebar verification, curing checks, and brickwork under experienced civil supervision.
            </p>
          </div>

          {/* Stage 4 */}
          <div className="border-l-2 border-stone-700 pl-6 space-y-3">
            <span className="text-xs font-mono uppercase text-stone-400">
              Stage 04
            </span>
            <h3 className="text-lg font-light text-stone-100">
              Interior Fit-out & Handover
            </h3>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Precision carpentry, marble polishing, sanitary fixtures, deep cleaning, and client walkthrough handover.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 border border-stone-800 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-light text-stone-100">
              Discuss Your Project With Our Engineering Team
            </h3>
            <p className="text-xs text-stone-400 mt-1 font-light">
              Visit our Bhopal office or send us your plot details.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 text-xs tracking-widest uppercase font-medium transition-colors"
          >
            <span>Initiate Conversation</span>
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
