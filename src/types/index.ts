export type ProjectStatus = "ongoing" | "completed";

export type DeliveryStatus = "Early" | "On Time" | "Delayed";

export interface ProjectMilestone {
  title: string;
  description?: string;
  targetDate?: string;
  completedDate?: string;
  isCompleted: boolean;
}

export interface IProject {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  category: "residential" | "interior" | "commercial" | "renovation";
  location: string;
  coverImage: string;
  coverImagePublicId?: string;
  images: string[];
  imagesPublicIds?: string[];
  startDate: string; // ISO date string
  expectedCompletionDate: string; // ISO date string
  actualCompletionDate?: string; // ISO date string (for completed projects)
  status: ProjectStatus;
  progressPercentage?: number; // 0-100 for ongoing projects
  milestones?: ProjectMilestone[];
  latestUpdate?: string;
  featured: boolean;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGalleryImage {
  _id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  publicId?: string;
  category: "living" | "bedroom" | "kitchen" | "bathroom" | "commercial" | "other" | "construction";
  featured?: boolean;
  published?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IService {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  deliverables?: string[];
  icon?: string;
  coverImage?: string;
  coverImagePublicId?: string;
  order: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBusinessSettings {
  _id?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface IGoogleReview {
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  text: string;
  relativePublishTimeDescription: string;
  publishTime?: string;
  authorUrl?: string;
}

export interface IGooglePlacesData {
  businessName: string;
  formattedAddress: string;
  rating: number;
  userRatingCount: number;
  reviews: IGoogleReview[];
  googleMapsUri: string;
  isLiveApi?: boolean;
}

export interface IContactEnquiry {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  projectType: string;
  message: string;
  location?: string;
  status: "new" | "reviewed" | "contacted" | "resolved" | "archived";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: "superadmin" | "admin" | "editor";
}

export interface AdminSessionPayload {
  sub: string;
  username: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface DashboardStats {
  totalCompletedProjects: number;
  totalOngoingProjects: number;
  totalGalleryImages: number;
  totalEnquiries: number;
  newEnquiriesCount: number;
  onTimeDeliveryPercentage: number;
  earlyDeliveryCount: number;
  onTimeDeliveryCount: number;
  delayedDeliveryCount: number;
  recentProjects: IProject[];
  latestEnquiries: IContactEnquiry[];
}
