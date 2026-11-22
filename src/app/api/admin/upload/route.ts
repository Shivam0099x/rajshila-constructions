import { NextRequest, NextResponse } from "next/server";
import {
  uploadToCloudinary,
  isCloudinaryConfigured,
  CloudinaryFolder,
} from "@/lib/cloudinary";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderParam = (formData.get("folder") as string) || "projects";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type: ${file.type}. Allowed formats: JPEG, PNG, WEBP, AVIF, SVG.`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds the 10MB limit.",
        },
        { status: 400 }
      );
    }

    const validFolders: Record<string, CloudinaryFolder> = {
      projects: "rajshila/projects",
      gallery: "rajshila/gallery",
      business: "rajshila/business",
      services: "rajshila/services",
    };

    const targetFolder = validFolders[folderParam] || "rajshila/projects";
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isCloudinaryConfigured()) {
      const uploadResult = await uploadToCloudinary(buffer, targetFolder, file.name);
      return NextResponse.json({
        success: true,
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
      });
    } else {
      // Local development fallback when Cloudinary API credentials have not been configured
      const base64Data = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64Data}`;
      return NextResponse.json({
        success: true,
        url: dataUri,
        publicId: `dev-local-${Date.now()}`,
        isDevFallback: true,
        notice: "Cloudinary credentials not set in .env.local; using local preview data URI.",
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload image",
      },
      { status: 500 }
    );
  }
}
