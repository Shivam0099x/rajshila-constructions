import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import { GalleryImage } from "@/models/GalleryImage";
import { Service } from "@/models/Service";
import { BusinessSettings } from "@/models/BusinessSettings";
import { DEMO_PROJECTS } from "@/constants/demo-projects";
import { DEMO_IMAGES } from "@/constants/demo-data";
import { BUSINESS_INFO } from "@/constants/business";
import { IProject, IGalleryImage, IService, IBusinessSettings } from "@/types";

/**
 * Server-side data fetcher for projects.
 * Direct DB query when connected, with graceful fallback to centralized demo architectural records.
 */
export async function getProjects(filter?: {
  status?: "ongoing" | "completed";
  category?: string;
  featured?: boolean;
}): Promise<IProject[]> {
  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn) {
      const totalInDb = await Project.countDocuments();
      if (totalInDb > 0) {
        const query: Record<string, unknown> = { published: true };
        if (filter?.status) query.status = filter.status;
        if (filter?.category && filter.category !== "all") query.category = filter.category;
        if (filter?.featured !== undefined) query.featured = filter.featured;

        const dbProjects = await Project.find(query).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(dbProjects));
      }
    }
  } catch (err) {
    console.warn("DB connection error in getProjects, utilizing demo projects:", err);
  }

  // Fallback to DEMO_PROJECTS only if DB has 0 records or is offline
  let results = [...DEMO_PROJECTS];
  if (filter?.status) {
    results = results.filter((p) => p.status === filter.status);
  }
  if (filter?.category && filter.category !== "all") {
    results = results.filter((p) => p.category === filter.category);
  }
  if (filter?.featured !== undefined) {
    results = results.filter((p) => p.featured === filter.featured);
  }
  return results;
}

/**
 * Server-side data fetcher for a single project by slug.
 */
export async function getProjectBySlug(slug: string): Promise<IProject | null> {
  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn) {
      const totalInDb = await Project.countDocuments();
      if (totalInDb > 0) {
        const project = await Project.findOne({ slug, published: true }).lean();
        return project ? JSON.parse(JSON.stringify(project)) : null;
      }
    }
  } catch (err) {
    console.warn("DB connection error in getProjectBySlug:", err);
  }

  const match = DEMO_PROJECTS.find((p) => p.slug === slug);
  return match || null;
}

/**
 * Server-side data fetcher for Gallery Images.
 */
export async function getGalleryImages(category?: string): Promise<IGalleryImage[]> {
  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn) {
      const totalInDb = await GalleryImage.countDocuments();
      if (totalInDb > 0) {
        const query: Record<string, unknown> = { published: { $ne: false } };
        if (category && category !== "all") query.category = category;
        const images = await GalleryImage.find(query).sort({ order: 1, createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(images));
      }
    }
  } catch (err) {
    console.warn("DB error in getGalleryImages, using centralized demo gallery:", err);
  }

  // Compile demo gallery images
  const allImages: IGalleryImage[] = [
    ...DEMO_IMAGES.interiors.living.map((img, i) => ({
      _id: `living-${i}`,
      title: img.title,
      description: img.description,
      imageUrl: img.url,
      category: "living" as const,
      featured: true,
      published: true,
      order: i,
    })),
    ...DEMO_IMAGES.interiors.bedroom.map((img, i) => ({
      _id: `bedroom-${i}`,
      title: img.title,
      description: img.description,
      imageUrl: img.url,
      category: "bedroom" as const,
      featured: true,
      published: true,
      order: i + 10,
    })),
    ...DEMO_IMAGES.interiors.kitchen.map((img, i) => ({
      _id: `kitchen-${i}`,
      title: img.title,
      description: img.description,
      imageUrl: img.url,
      category: "kitchen" as const,
      featured: true,
      published: true,
      order: i + 20,
    })),
    ...DEMO_IMAGES.interiors.bathroom.map((img, i) => ({
      _id: `bathroom-${i}`,
      title: img.title,
      description: img.description,
      imageUrl: img.url,
      category: "bathroom" as const,
      featured: true,
      published: true,
      order: i + 30,
    })),
    ...DEMO_IMAGES.interiors.commercial.map((img, i) => ({
      _id: `commercial-${i}`,
      title: img.title,
      description: img.description,
      imageUrl: img.url,
      category: "commercial" as const,
      featured: true,
      published: true,
      order: i + 40,
    })),
    ...DEMO_IMAGES.interiors.construction.map((img, i) => ({
      _id: `construction-${i}`,
      title: img.title,
      description: img.description,
      imageUrl: img.url,
      category: "construction" as const,
      featured: true,
      published: true,
      order: i + 50,
    })),
  ];

  if (category && category !== "all") {
    return allImages.filter((img) => img.category === category);
  }

  return allImages;
}

/**
 * Server-side data fetcher for Services from MongoDB
 */
export async function getServices(): Promise<IService[]> {
  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn) {
      const totalInDb = await Service.countDocuments();
      if (totalInDb > 0) {
        const dbServices = await Service.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean();
        return JSON.parse(JSON.stringify(dbServices));
      }
    }
  } catch (err) {
    console.warn("DB error in getServices:", err);
  }

  // Fallback to verified default services
  return BUSINESS_INFO.services.map((s, idx) => ({
    _id: `service-${s.id}`,
    title: s.title,
    slug: s.slug,
    shortDescription: s.shortDescription,
    icon: s.icon,
    order: idx,
    published: true,
    deliverables: [
      "Custom architectural drawings & site engineering",
      "High-grade raw materials and IS certified standards",
      "Itemized BOQ with documented milestones",
      "Turnkey civil supervision and finishing",
    ],
  }));
}

/**
 * Server-side data fetcher for Business Information Settings from MongoDB
 */
export async function getBusinessSettings(): Promise<IBusinessSettings> {
  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn) {
      const dbSettings = await BusinessSettings.findOne().lean();
      if (dbSettings) {
        return JSON.parse(JSON.stringify(dbSettings));
      }
    }
  } catch (err) {
    console.warn("DB error in getBusinessSettings:", err);
  }

  // Fallback to default verified settings
  return {
    businessName: BUSINESS_INFO.name,
    tagline: BUSINESS_INFO.tagline,
    shortDescription: BUSINESS_INFO.description,
    aboutText:
      "Founded and headquartered in Bhopal, Rajshila Construction provides a seamless integration of civil engineering, architectural structural work, and turnkey interior design.",
    address: BUSINESS_INFO.location.street,
    city: BUSINESS_INFO.location.city,
    state: BUSINESS_INFO.location.state,
    postalCode: BUSINESS_INFO.location.postalCode,
    country: BUSINESS_INFO.location.country,
    phone: BUSINESS_INFO.contact.phone,
    phoneDisplay: BUSINESS_INFO.contact.phoneDisplay,
    whatsapp: BUSINESS_INFO.contact.whatsappClean,
    email: BUSINESS_INFO.contact.email,
    openingHours: BUSINESS_INFO.hours.display,
    googleMapsUrl: BUSINESS_INFO.maps.listingUrl,
    heroHeadline: "Structural Integrity. Bespoke Architecture.",
    heroDescription: BUSINESS_INFO.description,
    heroCtaText: "Explore Projects",
    seoTitle: "Rajshila Construction | Architectural Construction & Interiors Bhopal",
    seoDescription: BUSINESS_INFO.description,
  };
}
