import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { Service } from "@/models/Service";
import { deleteFromCloudinary } from "@/lib/cloudinary";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const service = await Service.findById(id).lean();

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/services");

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error("Service GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const service = await Service.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/services");

    return NextResponse.json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    console.error("Service PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    if (service.coverImagePublicId) {
      await deleteFromCloudinary(service.coverImagePublicId);
    }

    await Service.findByIdAndDelete(id);

    revalidatePath("/");
    revalidatePath("/services");

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Service DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
