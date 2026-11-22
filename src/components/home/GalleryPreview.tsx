import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DEMO_IMAGES, DEMO_NOTICE } from "@/constants/demo-data";

export function GalleryPreview() {
  const previewImages = [
    {
      ...DEMO_IMAGES.interiors.living[0],
      span: "md:col-span-2 md:row-span-2",
      heightClass: "h-96 md:h-full",
    },
    {
      ...DEMO_IMAGES.interiors.kitchen[0],
      span: "md:col-span-1",
      heightClass: "h-72",
    },
    {
      ...DEMO_IMAGES.interiors.bedroom[0],
      span: "md:col-span-1",
      heightClass: "h-72",
    },
    {
      ...DEMO_IMAGES.interiors.bathroom[0],
      span: "md:col-span-1",
      heightClass: "h-72",
    },
    {
      ...DEMO_IMAGES.interiors.commercial[0],
      span: "md:col-span-1",
      heightClass: "h-72",
    },
  ];

  return (
    <section className="py-24 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <SectionHeader
            eyebrow="Architectural Visuals"
            title="Interior & Design Gallery"
            description="A visual curation of modern living pavilions, master suites, quartz kitchens, and commercial interiors designed with tailored materiality."
            dark
            className="mb-0 max-w-2xl"
          />

          <div className="mt-6 md:mt-0">
            <Link
              href="/gallery"
              className="inline-flex items-center text-xs tracking-widest uppercase text-amber-400 hover:text-white transition-colors border-b border-amber-400/60 pb-1"
            >
              <span>Explore Full Gallery</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>

        {/* Editorial Masonry/Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
          {previewImages.slice(0, 5).map((img, i) => (
            <Link
              key={i}
              href="/gallery"
              className={`group relative w-full h-full min-h-[280px] overflow-hidden bg-stone-900 border border-stone-800 block ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <Image
                src={img.url}
                alt={img.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                <span className="text-[11px] uppercase tracking-widest font-mono text-amber-400 mb-1">
                  {img.category}
                </span>
                <h4 className="text-lg font-light text-stone-100 group-hover:text-amber-200 transition-colors">
                  {img.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>

        {/* Demo Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-stone-500 font-mono tracking-wider">
            {DEMO_NOTICE}
          </p>
        </div>
      </div>
    </section>
  );
}
