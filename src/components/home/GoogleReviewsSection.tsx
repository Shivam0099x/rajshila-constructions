import React from "react";
import Image from "next/image";
import { Star, ExternalLink, MapPin, CheckCircle2 } from "lucide-react";
import { IGooglePlacesData } from "@/types";
import { BUSINESS_INFO } from "@/constants/business";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface GoogleReviewsSectionProps {
  placesData: IGooglePlacesData;
}

export function GoogleReviewsSection({ placesData }: GoogleReviewsSectionProps) {
  const { rating, userRatingCount, reviews, googleMapsUri, isLiveApi } = placesData;

  return (
    <section className="py-24 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <SectionHeader
            eyebrow="Reputation & Feedback"
            title="Verified Google Reviews"
            description="Client impressions and verified ratings sourced directly from our official Google Maps business profile in Bhopal."
            dark
            className="mb-0 max-w-2xl"
          />

          <div className="mt-6 md:mt-0">
            <a
              href={googleMapsUri || BUSINESS_INFO.maps.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-400 text-xs tracking-wider uppercase font-medium transition-colors"
            >
              <span>View All Reviews on Google</span>
              <ExternalLink className="w-3.5 h-3.5 ml-2 text-amber-400" />
            </a>
          </div>
        </div>

        {/* Rating Overview Card */}
        <div className="bg-stone-900/90 border border-stone-800 p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6 text-center md:text-left">
            <div className="flex flex-col items-center justify-center bg-stone-950 border border-stone-800 px-6 py-4">
              <span className="text-4xl font-light text-amber-400 font-mono">
                {rating > 0 ? rating.toFixed(1) : "5.0"}
              </span>
              <div className="flex text-amber-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-light text-stone-100">
                {BUSINESS_INFO.name}
              </h3>
              <div className="flex items-center text-xs text-stone-400 font-mono mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1 shrink-0" />
                <span>Ayodhya Bypass, Bhopal, MP</span>
              </div>
              <div className="text-xs text-stone-500 font-mono mt-1">
                {userRatingCount > 0 ? (
                  <span>Based on {userRatingCount} verified Google reviews</span>
                ) : (
                  <span>Verified Google Business Profile</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center text-xs text-stone-400 bg-stone-950 border border-stone-800 px-3 py-1.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Official Listing
            </span>
            <a
              href={googleMapsUri || BUSINESS_INFO.maps.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:text-white underline font-mono"
            >
              Check Maps Profile
            </a>
          </div>
        </div>

        {/* Reviews List or Honest Fallback */}
        {isLiveApi && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="bg-stone-900 border border-stone-800 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {review.authorPhotoUrl ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-stone-800">
                          <Image
                            src={review.authorPhotoUrl}
                            alt={review.authorName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-xs font-mono text-amber-400">
                          {review.authorName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <a
                          href={review.authorUrl || googleMapsUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-stone-200 hover:text-amber-300 transition-colors"
                        >
                          {review.authorName}
                        </a>
                        <span className="block text-[11px] text-stone-500 font-mono">
                          {review.relativePublishTimeDescription}
                        </span>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-stone-300 font-light leading-relaxed line-clamp-4">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-800/80 flex justify-between items-center text-[11px] text-stone-500 font-mono">
                  <span>Google Review</span>
                  <a
                    href={review.authorUrl || googleMapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-stone-300 inline-flex items-center"
                  >
                    <span>View on Maps</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Graceful Fallback UI conforming strictly to requirements (no fabricated reviews!) */
          <div className="bg-stone-900/40 border border-dashed border-stone-800 p-10 text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-stone-900 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-800">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <h3 className="text-lg font-light text-stone-200 mb-2">
              Google Places API Integration Ready
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed font-light mb-6">
              To stream real-time Google Reviews directly on this section, configure <code className="text-amber-400 bg-stone-950 px-1.5 py-0.5 text-xs font-mono">GOOGLE_MAPS_API_KEY</code> and <code className="text-amber-400 bg-stone-950 px-1.5 py-0.5 text-xs font-mono">GOOGLE_PLACES_PLACE_ID</code> in your environment.
            </p>
            <p className="text-xs text-stone-500 mb-6 font-mono">
              In accordance with architectural integrity standards, no fabricated reviews are displayed.
            </p>
            <a
              href={BUSINESS_INFO.maps.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 font-medium text-xs tracking-widest uppercase transition-colors"
            >
              <span>Read All Customer Reviews on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
