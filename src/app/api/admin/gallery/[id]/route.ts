import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { GalleryImage } from "@/models/GalleryImage";
import { deleteFromCloudinary } from "@/lib/cloudinary";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const image = await GalleryImage.findById(id).lean();

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error("Gallery GET single error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const image = await GalleryImage.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/gallery");

    return NextResponse.json({
      success: true,
      message: "Image updated successfully",
      data: image,
    });
  } catch (error) {
    console.error("Gallery PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update image" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const image = await GalleryImage.findById(id);
    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    if (image.publicId) {
      await deleteFromCloudinary(image.publicId);
    }

    await GalleryImage.findByIdAndDelete(id);

    revalidatePath("/");
    revalidatePath("/gallery");

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Gallery DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
