import { BUSINESS_INFO } from "@/constants/business";
import { IGooglePlacesData, IGoogleReview } from "@/types";

interface GooglePlacesApiResponse {
  displayName?: {
    text?: string;
    languageCode?: string;
  };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: Array<{
    name?: string;
    relativePublishTimeDescription?: string;
    rating?: number;
    text?: {
      text?: string;
      languageCode?: string;
    };
    originalText?: {
      text?: string;
      languageCode?: string;
    };
    authorAttribution?: {
      displayName?: string;
      uri?: string;
      photoUri?: string;
    };
    publishTime?: string;
  }>;
}

/**
 * Server-side helper to fetch Google Reviews using Google Places API (New).
 * Respects Google's review attribution guidelines and caching.
 */
export async function getGooglePlacesData(): Promise<IGooglePlacesData> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId =
    process.env.GOOGLE_MAPS_PLACE_ID || process.env.GOOGLE_PLACES_PLACE_ID;

  // Fallback data when API Key or Place ID is not configured
  const fallbackData: IGooglePlacesData = {
    businessName: BUSINESS_INFO.name,
    formattedAddress: BUSINESS_INFO.location.formattedAddress,
    rating: 5.0,
    userRatingCount: 0,
    reviews: [],
    googleMapsUri: BUSINESS_INFO.maps.listingUrl,
    isLiveApi: false,
  };

  if (!apiKey || !placeId) {
    return fallbackData;
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "displayName,formattedAddress,rating,userRatingCount,googleMapsUri,reviews",
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    // if (!response.ok) {
    //   console.error(
    //     `Google Places API error: ${response.status} ${response.statusText}`
    //   );
    //   return fallbackData;
    // }

    if (!response.ok) {
  const errorBody = await response.text();
  console.error(`Google Places API error: ${response.status}`, errorBody);
  return fallbackData;
}

    const data: GooglePlacesApiResponse = await response.json();

    const formattedReviews: IGoogleReview[] = (data.reviews || [])
      .slice(0, 5)
      .map((r) => ({
        authorName: r.authorAttribution?.displayName || "Google Reviewer",
        authorPhotoUrl: r.authorAttribution?.photoUri,
        authorUrl: r.authorAttribution?.uri || BUSINESS_INFO.maps.listingUrl,
        rating: r.rating || 5,
        text: r.text?.text || r.originalText?.text || "",
        relativePublishTimeDescription:
          r.relativePublishTimeDescription || "Recently",
        publishTime: r.publishTime,
      }));

    return {
      businessName: data.displayName?.text || BUSINESS_INFO.name,
      formattedAddress: data.formattedAddress || BUSINESS_INFO.location.formattedAddress,
      rating: data.rating || 5.0,
      userRatingCount: data.userRatingCount || 0,
      reviews: formattedReviews,
      googleMapsUri: data.googleMapsUri || BUSINESS_INFO.maps.listingUrl,
      isLiveApi: true,
    };
  } catch (error) {
    console.error("Failed to fetch Google Places data:", error);
    return fallbackData;
  }
}
