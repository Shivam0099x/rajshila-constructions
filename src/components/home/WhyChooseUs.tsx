import React from "react";
import {
  ShieldAlert,
  Layers,
  CalendarCheck,
  Receipt,
  MapPin,
  Sparkles,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const REASONS = [
  {
    icon: ShieldAlert,
    title: "Engineering Rigor & Certified Standards",
    description:
      "We build with strict adherence to Indian structural codes (IS 456), utilizing certified high-grade concrete, anti-corrosive reinforcement steel, and multi-stage damp-proofing.",
  },
  {
    icon: Layers,
    title: "Integrated Civil & Interior Delivery",
    description:
      "No friction between structural builders and interior carpenters. We map electrical conduits, plumbing shafts, and false ceiling recesses from the structural slab pour.",
  },
  {
    icon: CalendarCheck,
    title: "Documented Milestone Tracking",
    description:
      "Every project follows a transparent schedule with predefined completion benchmarks, weekly progress updates, and committed handover dates.",
  },
  {
    icon: Receipt,
    title: "Itemized BOQ & Zero Hidden Costs",
    description:
      "Detailed bills of quantities specifying brands, grades, thickness, and hardware upfront. Clear payment milestones tied to verifiable physical progress.",
  },
  {
    icon: MapPin,
    title: "Bhopal Regional Expertise",
    description:
      "Deep understanding of Bhopal's black cotton soil foundations, local climate variations, quarry materials, and municipal building regulations.",
  },
  {
    icon: Sparkles,
    title: "Bespoke Material Curation",
    description:
      "Hand-selected natural stones, Italian marble, marine-grade plywood, architectural veneers, and branded hardware tailored to modern aesthetics.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="The Rajshila Benchmark"
          title="Why Discerning Homeowners Choose Us"
          description="A systematic, engineering-first approach that prioritizes structural safety, aesthetic restraint, and transparent project delivery."
          align="center"
          dark
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {REASONS.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div
                key={idx}
                className="bg-stone-950/60 border border-stone-800 p-8 flex flex-col justify-start transition-all duration-300 hover:border-amber-400/50"
              >
                <div className="p-3 bg-stone-900 border border-stone-800 text-amber-400 w-fit mb-6">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-light text-stone-100 mb-3">
                  {reason.title}
                </h3>
                <p className="text-sm text-stone-400 font-light leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
