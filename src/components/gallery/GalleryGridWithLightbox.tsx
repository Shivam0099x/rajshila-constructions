"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2, Tag } from "lucide-react";
import { IGalleryImage } from "@/types";
import { GALLERY_CATEGORIES, DEMO_NOTICE } from "@/constants/demo-data";
import { cn } from "@/lib/utils";

interface GalleryGridWithLightboxProps {
  initialImages: IGalleryImage[];
}

export function GalleryGridWithLightbox({ initialImages }: GalleryGridWithLightboxProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const filteredImages =
    selectedCategory === "all"
      ? initialImages
      : initialImages.filter((img) => img.category === selectedCategory);

  const activeImage =
    activeImageIndex !== null ? filteredImages[activeImageIndex] : null;

  const handleNext = useCallback(() => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) =>
      prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0
    );
  }, [activeImageIndex, filteredImages.length]);

  const handlePrev = useCallback(() => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1
    );
  }, [activeImageIndex, filteredImages.length]);

  const handleClose = useCallback(() => {
    setActiveImageIndex(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, handleClose, handleNext, handlePrev]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (activeImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeImageIndex]);

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {GALLERY_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveImageIndex(null);
              }}
              className={cn(
                "px-5 py-2 text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer border",
                isActive
                  ? "bg-[#B58D54] text-stone-950 font-semibold border-[#B58D54]"
                  : "bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-600 hover:text-stone-200"
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Editorial Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image, index) => (
          <div
            key={image._id || index}
            onClick={() => setActiveImageIndex(index)}
            className="group relative aspect-[4/3] w-full bg-stone-900 border border-stone-800 overflow-hidden cursor-pointer"
          >
            <Image
              src={image.imageUrl}
              alt={image.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-mono bg-stone-950/80 px-2 py-0.5 border border-stone-800">
                  {image.category}
                </span>
                <div className="p-2 bg-stone-900/90 text-stone-200 hover:text-amber-400">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-light text-stone-100 mb-1">
                  {image.title}
                </h3>
                {image.description && (
                  <p className="text-xs text-stone-400 line-clamp-2 font-light">
                    {image.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-20 bg-stone-900/40 border border-dashed border-stone-800 p-8">
          <p className="text-stone-400 text-sm">
            No gallery images found in this category.
          </p>
        </div>
      )}

      {/* Conceptual Disclaimer */}
      <div className="mt-12 text-center">
        <p className="text-xs text-stone-500 font-mono tracking-wider">
          {DEMO_NOTICE}
        </p>
      </div>

      {/* Full-Screen Lightbox Modal */}
      {activeImage && activeImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={handleClose}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-6 right-6 p-3 text-stone-400 hover:text-white bg-stone-900 border border-stone-800 rounded-none z-10 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 text-stone-400 hover:text-white bg-stone-900/80 border border-stone-800 z-10 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 text-stone-400 hover:text-white bg-stone-900/80 border border-stone-800 z-10 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Content */}
          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[60vh] sm:h-[70vh] bg-black">
              <Image
                src={activeImage.imageUrl}
                alt={activeImage.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
              />
            </div>

            {/* Lightbox Caption & Details */}
            <div className="w-full bg-stone-900 border-x border-b border-stone-800 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[11px] uppercase tracking-widest text-amber-400 font-mono inline-flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    {activeImage.category}
                  </span>
                  <span className="text-stone-600">•</span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {activeImageIndex + 1} of {filteredImages.length}
                  </span>
                </div>
                <h4 className="text-lg font-light text-stone-100">
                  {activeImage.title}
                </h4>
                {activeImage.description && (
                  <p className="text-xs text-stone-400 font-light mt-1 max-w-2xl">
                    {activeImage.description}
                  </p>
                )}
              </div>

              <div className="shrink-0 text-right">
                <span className="text-[10px] text-stone-500 font-mono block">
                  Reference Concept
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  Rajshila Construction
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
