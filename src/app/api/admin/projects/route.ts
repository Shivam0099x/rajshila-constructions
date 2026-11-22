import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";

const milestoneSchema = z.object({
  title: z.string().min(1, "Milestone title is required"),
  description: z.string().optional(),
  targetDate: z.string().optional().nullable(),
  completedDate: z.string().optional().nullable(),
  isCompleted: z.boolean().default(false),
});

const projectInputSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(150),
  slug: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["residential", "interior", "commercial", "renovation"]),
  location: z.string().min(2, "Location is required"),
  coverImage: z.string().min(1, "Cover image URL is required"),
  coverImagePublicId: z.string().optional(),
  images: z.array(z.string()).default([]),
  imagesPublicIds: z.array(z.string()).default([]),
  startDate: z.string().min(1, "Start date is required"),
  expectedCompletionDate: z.string().min(1, "Expected completion date is required"),
  actualCompletionDate: z.string().optional().nullable(),
  status: z.enum(["ongoing", "completed"]).default("ongoing"),
  progressPercentage: z.number().min(0).max(100).default(0),
  milestones: z.array(milestoneSchema).default([]),
  latestUpdate: z.string().optional(),
  featured: z.boolean().default(false),
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

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "100", 10)));
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (category && category !== "all") query.category = category;

    const [projects, total] = await Promise.all([
      Project.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Project.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      count: projects.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: projects,
    });
  } catch (error) {
    console.error("Admin projects GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const parseResult = projectInputSchema.safeParse(body);

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

    // Timeline rule: Completed projects MUST have actualCompletionDate
    if (data.status === "completed" && !data.actualCompletionDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Actual completion date is mandatory for completed projects.",
        },
        { status: 400 }
      );
    }

    // Generate unique slug
    let generatedSlug = data.slug ? slugify(data.slug) : slugify(data.title);
    if (!generatedSlug) generatedSlug = `project-${Date.now()}`;

    let slugCandidate = generatedSlug;
    let counter = 1;
    while (await Project.exists({ slug: slugCandidate })) {
      slugCandidate = `${generatedSlug}-${counter}`;
      counter++;
    }

    const newProject = await Project.create({
      title: data.title,
      slug: slugCandidate,
      description: data.description,
      category: data.category,
      location: data.location,
      coverImage: data.coverImage,
      coverImagePublicId: data.coverImagePublicId,
      images: data.images,
      imagesPublicIds: data.imagesPublicIds,
      startDate: new Date(data.startDate),
      expectedCompletionDate: new Date(data.expectedCompletionDate),
      actualCompletionDate: data.actualCompletionDate ? new Date(data.actualCompletionDate) : undefined,
      status: data.status,
      progressPercentage: data.status === "completed" ? 100 : data.progressPercentage,
      milestones: data.milestones.map((m) => ({
        title: m.title,
        description: m.description,
        targetDate: m.targetDate ? new Date(m.targetDate) : undefined,
        completedDate: m.completedDate ? new Date(m.completedDate) : undefined,
        isCompleted: m.isCompleted,
      })),
      latestUpdate: data.latestUpdate,
      featured: data.featured,
      published: data.published,
    });

    await newProject.save();

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/ongoing-projects");

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: newProject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin project POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create project",
      },
      { status: 500 }
    );
  }
}
