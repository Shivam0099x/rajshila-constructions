import React from "react";
import { Metadata } from "next";
import { getGalleryImages } from "@/lib/data-fetchers";
import { GalleryGridWithLightbox } from "@/components/gallery/GalleryGridWithLightbox";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Interior & Architectural Gallery | Curation of Spaces",
  description:
    "Explore luxury living rooms, serene master suites, modern quartz kitchens, spa bathrooms, and commercial interiors curated by Rajshila Construction.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="bg-stone-950 text-stone-100 pt-28 pb-24 min-h-screen">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-mono block mb-3">
            Spatial Curation
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
            Visual Gallery. <br />
            <span className="font-serif-luxury italic text-stone-300">
              Form, Texture & Illumination.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-400 font-light leading-relaxed">
            A comprehensive curation of residential and commercial spaces. Click any visual to inspect details in full-screen architectural resolution.
          </p>
        </div>
      </section>

      {/* Interactive Gallery with Category Filters and Lightbox */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryGridWithLightbox initialImages={images} />
      </section>
    </div>
  );
}
