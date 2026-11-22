import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { Service } from "@/models/Service";

const serviceInputSchema = z.object({
  title: z.string().min(2, "Title is required").max(120),
  slug: z.string().optional(),
  shortDescription: z.string().min(10, "Short description is required").max(300),
  fullDescription: z.string().optional(),
  deliverables: z.array(z.string()).default([]),
  icon: z.string().default("Home"),
  coverImage: z.string().optional(),
  coverImagePublicId: z.string().optional(),
  order: z.number().default(0),
  published: z.boolean().default(true),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    await connectToDatabase();
    const services = await Service.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, count: services.length, data: services });
  } catch (error) {
    console.error("Services GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const parseResult = serviceInputSchema.safeParse(body);

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

    const data = parseResult.data;
    let generatedSlug = data.slug ? slugify(data.slug) : slugify(data.title);
    if (!generatedSlug) generatedSlug = `service-${Date.now()}`;

    let slugCandidate = generatedSlug;
    let counter = 1;
    while (await Service.exists({ slug: slugCandidate })) {
      slugCandidate = `${generatedSlug}-${counter}`;
      counter++;
    }

    const newService = await Service.create({
      ...data,
      slug: slugCandidate,
    });

    revalidatePath("/");
    revalidatePath("/services");

    return NextResponse.json(
      {
        success: true,
        message: "Service created successfully",
        data: newService,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Services POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create service" },
      { status: 500 }
    );
  }
}
