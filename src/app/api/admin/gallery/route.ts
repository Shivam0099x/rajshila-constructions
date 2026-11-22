import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { GalleryImage } from "@/models/GalleryImage";

const galleryInputSchema = z.object({
  title: z.string().min(2, "Title is required").max(120),
  description: z.string().max(300).optional(),
  imageUrl: z.string().min(1, "Image URL is required"),
  publicId: z.string().optional(),
  category: z.enum([
    "living",
    "bedroom",
    "kitchen",
    "bathroom",
    "commercial",
    "other",
    "construction",
  ]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().default(0),
});

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "100", 10)));
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (category && category !== "all") query.category = category;

    const [images, total] = await Promise.all([
      GalleryImage.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      GalleryImage.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      count: images.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: images,
    });
  } catch (error) {
    console.error("Gallery GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const parseResult = galleryInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const newImage = await GalleryImage.create(parseResult.data);

    revalidatePath("/");
    revalidatePath("/gallery");

    return NextResponse.json(
      {
        success: true,
        message: "Image added to gallery",
        data: newImage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create gallery image" },
      { status: 500 }
    );
  }
}
