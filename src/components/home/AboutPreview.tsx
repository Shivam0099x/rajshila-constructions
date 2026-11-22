import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { DEMO_IMAGES } from "@/constants/demo-data";

export function AboutPreview() {
  const architecturalImage = DEMO_IMAGES.architecture[1];

  return (
    <section className="py-24 bg-stone-100 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Architectural Image Presentation (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-200 shadow-xl border border-stone-300">
              <Image
                src={architecturalImage}
                alt="Rajshila Construction Architectural Standards"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Architectural Label Badge */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-stone-900 text-stone-100 p-6 shadow-2xl max-w-xs border border-stone-800 hidden sm:block">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-mono block mb-1">
                Regional Focus
              </span>
              <p className="text-sm font-light text-stone-300">
                Ground-up civil execution and interior turnkey fit-outs across Bhopal and Central MP.
              </p>
            </div>
          </div>

          {/* About Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-amber-800">
              About Rajshila Construction
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 tracking-tight leading-tight">
              Engineering with precision, designing with purposeful elegance.
            </h2>

            <p className="text-base text-stone-700 leading-relaxed font-light">
              Founded and headquartered in Bhopal, Rajshila Construction provides a seamless integration of civil engineering, architectural structural work, and turnkey interior design. Rather than treating structure and interiors as disconnected phases, our multidisciplinary team coordinates every conduit, load-bearing line, and surface treatment from day one.
            </p>

            <p className="text-base text-stone-700 leading-relaxed font-light">
              We eliminate the traditional friction of multiple sub-contractors by providing client-direct accountability, standardized BOQ transparency, and documented milestone schedules for residential and commercial spaces.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-stone-900 text-amber-400 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-900">
                    Bespoke Construction
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Seismic-conscious structural engineering & quality materials.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1 bg-stone-900 text-amber-400 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-900">
                    Turnkey Interior Fit-outs
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Factory-finish joinery, false ceiling, and lighting automation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1 bg-stone-900 text-amber-400 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-900">
                    Transparent Costing
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Clear itemized BOQs with zero hidden surcharges.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1 bg-stone-900 text-amber-400 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-900">
                    Documented Timelines
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Strict adherence to agreed completion milestones.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center text-xs tracking-widest uppercase font-medium text-stone-950 border-b border-stone-900 pb-1 hover:text-amber-800 hover:border-amber-800 transition-colors"
              >
                <span>Read Full Company Profile</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
