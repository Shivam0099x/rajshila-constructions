import mongoose, { Schema, Model } from "mongoose";

export interface IBusinessSettingsDocument extends mongoose.Document {
  businessName: string;
  logoUrl?: string;
  logoPublicId?: string;
  tagline: string;
  shortDescription: string;
  aboutText: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  phoneDisplay?: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  googleMapsUrl: string;
  placeId?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  heroHeadline?: string;
  heroDescription?: string;
  heroCtaText?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSettingsSchema = new Schema<IBusinessSettingsDocument>(
  {
    businessName: {
      type: String,
      default: "Rajshila Construction",
      trim: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    logoPublicId: {
      type: String,
      trim: true,
    },
    tagline: {
      type: String,
      default: "Architectural Construction & Turnkey Interior Design",
      trim: true,
    },
    shortDescription: {
      type: String,
      default:
        "Rajshila Construction is a premier building contractor and interior design firm based in Bhopal, Madhya Pradesh. Specializing in high-end residential construction, structural engineering, and bespoke interior spaces executed with uncompromising craftsmanship.",
      trim: true,
    },
    aboutText: {
      type: String,
      default:
        "Founded and headquartered in Bhopal, Rajshila Construction provides a seamless integration of civil engineering, architectural structural work, and turnkey interior design. Rather than treating structure and interiors as disconnected phases, our multidisciplinary team coordinates every conduit, load-bearing line, and surface treatment from day one.",
      trim: true,
    },
    address: {
      type: String,
      default: "Near Tanatan Dhaba, B Sector, Sector A, Rajeev Nagar, Ayodhya Bypass",
      trim: true,
    },
    city: {
      type: String,
      default: "Bhopal",
      trim: true,
    },
    state: {
      type: String,
      default: "Madhya Pradesh",
      trim: true,
    },
    postalCode: {
      type: String,
      default: "462022",
      trim: true,
    },
    country: {
      type: String,
      default: "India",
      trim: true,
    },
    phone: {
      type: String,
      default: "+91 81095 15701",
      trim: true,
    },
    phoneDisplay: {
      type: String,
      default: "+91 81095 15701",
      trim: true,
    },
    whatsapp: {
      type: String,
      default: "918109515701",
      trim: true,
    },
    email: {
      type: String,
      default: "contact@rajshilaconstruction.com",
      trim: true,
    },
    openingHours: {
      type: String,
      default: "Monday – Sunday: 9:00 AM – 9:00 PM",
      trim: true,
    },
    googleMapsUrl: {
      type: String,
      default: "https://maps.app.goo.gl/ww4iqoQmUGk8VbPn6",
      trim: true,
    },
    placeId: {
      type: String,
      trim: true,
    },
    facebookUrl: {
      type: String,
      trim: true,
    },
    instagramUrl: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      trim: true,
    },
    heroHeadline: {
      type: String,
      default: "Structural Integrity. Bespoke Architecture.",
      trim: true,
    },
    heroDescription: {
      type: String,
      default:
        "Rajshila Construction is a premier building contractor and interior design firm based in Bhopal, Madhya Pradesh. Specializing in high-end residential construction, structural engineering, and bespoke interior spaces executed with uncompromising craftsmanship.",
      trim: true,
    },
    heroCtaText: {
      type: String,
      default: "Explore Projects",
      trim: true,
    },
    seoTitle: {
      type: String,
      default: "Rajshila Construction | Architectural Construction & Interiors Bhopal",
      trim: true,
    },
    seoDescription: {
      type: String,
      default:
        "Premier residential building contractor and interior design firm in Bhopal, Madhya Pradesh. Ground-up civil construction, structural engineering, and bespoke turnkey interior design.",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BusinessSettings: Model<IBusinessSettingsDocument> =
  mongoose.models.BusinessSettings ||
  mongoose.model<IBusinessSettingsDocument>("BusinessSettings", BusinessSettingsSchema);

export default BusinessSettings;
