import React from "react";
import { BUSINESS_INFO } from "@/constants/business";

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: BUSINESS_INFO.name,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "@id": BUSINESS_INFO.maps.listingUrl,
    url: "https://rajshilaconstruction.com",
    telephone: BUSINESS_INFO.contact.phoneClean,
    priceRange: "₹₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_INFO.location.street,
      addressLocality: BUSINESS_INFO.location.city,
      addressRegion: BUSINESS_INFO.location.state,
      postalCode: BUSINESS_INFO.location.postalCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_INFO.location.coordinates.lat,
      longitude: BUSINESS_INFO.location.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    sameAs: [BUSINESS_INFO.maps.listingUrl],
    description: BUSINESS_INFO.description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
