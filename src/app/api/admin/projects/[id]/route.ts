import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import { deleteFromCloudinary } from "@/lib/cloudinary";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const project = await Project.findById(id).lean();
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("Project GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Timeline validation rule: if marked completed or status is completed, actualCompletionDate is mandatory
    const isCompleted = body.status === "completed";
    if (isCompleted && !body.actualCompletionDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Actual completion date is mandatory for completed projects.",
        },
        { status: 400 }
      );
    }

    // Update fields
    if (body.title !== undefined) existingProject.title = body.title;
    if (body.description !== undefined) existingProject.description = body.description;
    if (body.category !== undefined) existingProject.category = body.category;
    if (body.location !== undefined) existingProject.location = body.location;
    if (body.coverImage !== undefined) existingProject.coverImage = body.coverImage;
    if (body.coverImagePublicId !== undefined) existingProject.coverImagePublicId = body.coverImagePublicId;
    if (body.images !== undefined) existingProject.images = body.images;
    if (body.imagesPublicIds !== undefined) existingProject.imagesPublicIds = body.imagesPublicIds;
    if (body.startDate !== undefined) existingProject.startDate = new Date(body.startDate);
    if (body.expectedCompletionDate !== undefined)
      existingProject.expectedCompletionDate = new Date(body.expectedCompletionDate);
    if (body.actualCompletionDate !== undefined) {
      existingProject.actualCompletionDate = body.actualCompletionDate
        ? new Date(body.actualCompletionDate)
        : undefined;
    }
    if (body.status !== undefined) {
      existingProject.status = body.status;
      if (body.status === "completed") {
        existingProject.progressPercentage = 100;
      }
    }
    if (body.progressPercentage !== undefined && body.status !== "completed") {
      existingProject.progressPercentage = body.progressPercentage;
    }
    if (body.milestones !== undefined) {
      existingProject.milestones = body.milestones.map((m: {
        title: string;
        description?: string;
        targetDate?: string;
        completedDate?: string;
        isCompleted?: boolean;
      }) => ({
        title: m.title,
        description: m.description,
        targetDate: m.targetDate ? new Date(m.targetDate) : undefined,
        completedDate: m.completedDate ? new Date(m.completedDate) : undefined,
        isCompleted: m.isCompleted ?? false,
      }));
    }
    if (body.latestUpdate !== undefined) existingProject.latestUpdate = body.latestUpdate;
    if (body.featured !== undefined) existingProject.featured = body.featured;
    if (body.published !== undefined) existingProject.published = body.published;

    await existingProject.save();

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/ongoing-projects");
    if (existingProject.slug) {
      revalidatePath(`/projects/${existingProject.slug}`);
    }

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      data: existingProject,
    });
  } catch (error) {
    console.error("Project PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Clean up Cloudinary assets if any
    if (project.coverImagePublicId) {
      await deleteFromCloudinary(project.coverImagePublicId);
    }
    if (project.imagesPublicIds && project.imagesPublicIds.length > 0) {
      for (const pId of project.imagesPublicIds) {
        await deleteFromCloudinary(pId);
      }
    }

    await Project.findByIdAndDelete(id);

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/ongoing-projects");
    if (project.slug) {
      revalidatePath(`/projects/${project.slug}`);
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Project DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
