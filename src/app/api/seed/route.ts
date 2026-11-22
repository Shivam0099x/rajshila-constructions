import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import { BusinessSettings } from "@/models/BusinessSettings";
import { GalleryImage } from "@/models/GalleryImage";
import { DEMO_PROJECTS } from "@/constants/demo-projects";
import { BUSINESS_INFO } from "@/constants/business";
import { getGalleryImages } from "@/lib/data-fetchers";

export async function POST() {
  try {
    const mongooseConn = await connectToDatabase();
    if (!mongooseConn) {
      return NextResponse.json(
        {
          success: false,
          error: "MongoDB connection is not configured in environment variables.",
        },
        { status: 400 }
      );
    }

    // 1. Seed Business Settings if not present
    const existingSettings = await BusinessSettings.findOne();
    if (!existingSettings) {
      await BusinessSettings.create({
        businessName: BUSINESS_INFO.name,
        tagline: BUSINESS_INFO.tagline,
        address: BUSINESS_INFO.location.street,
        city: BUSINESS_INFO.location.city,
        state: BUSINESS_INFO.location.state,
        postalCode: BUSINESS_INFO.location.postalCode,
        phone: BUSINESS_INFO.contact.phone,
        whatsapp: BUSINESS_INFO.contact.whatsappClean,
        email: BUSINESS_INFO.contact.email,
        openingHours: BUSINESS_INFO.hours.display,
        googleMapsUrl: BUSINESS_INFO.maps.listingUrl,
        aboutText: BUSINESS_INFO.description,
      });
    }

    // 2. Seed Projects if none exist
    const projectCount = await Project.countDocuments();
    let seededProjectsCount = 0;
    if (projectCount === 0) {
      for (const p of DEMO_PROJECTS) {
        await Project.create({
          title: p.title,
          slug: p.slug,
          description: p.description,
          category: p.category,
          location: p.location,
          coverImage: p.coverImage,
          images: p.images,
          startDate: new Date(p.startDate),
          expectedCompletionDate: new Date(p.expectedCompletionDate),
          actualCompletionDate: p.actualCompletionDate ? new Date(p.actualCompletionDate) : undefined,
          status: p.status,
          progressPercentage: p.progressPercentage || 0,
          milestones: p.milestones?.map((m) => ({
            title: m.title,
            description: m.description,
            targetDate: m.targetDate ? new Date(m.targetDate) : undefined,
            completedDate: m.completedDate ? new Date(m.completedDate) : undefined,
            isCompleted: m.isCompleted,
          })),
          latestUpdate: p.latestUpdate,
          featured: p.featured,
          published: p.published,
        });
        seededProjectsCount++;
      }
    }

    // 3. Seed Gallery Images if none exist
    const galleryCount = await GalleryImage.countDocuments();
    let seededGalleryCount = 0;
    if (galleryCount === 0) {
      const demoGallery = await getGalleryImages();
      for (const item of demoGallery) {
        await GalleryImage.create({
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          category: item.category,
          featured: item.featured ?? false,
          order: item.order ?? 0,
        });
        seededGalleryCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      seeded: {
        projects: seededProjectsCount,
        galleryImages: seededGalleryCount,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed database",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
