import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type CloudinaryFolder =
  | "rajshila/projects"
  | "rajshila/gallery"
  | "rajshila/business"
  | "rajshila/services";

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Upload a file buffer or base64 data to Cloudinary with folder organization
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: CloudinaryFolder,
  fileName?: string
): Promise<UploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary credentials are not configured in environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)."
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: fileName ? fileName.replace(/\.[^/.]+$/, "") : undefined,
        resource_type: "image",
        transformation: [
          { quality: "auto:best" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          return reject(error || new Error("Cloudinary upload failed"));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete an asset from Cloudinary by public ID
 */
export async function deleteFromCloudinary(publicId?: string): Promise<boolean> {
  if (!publicId || !isCloudinaryConfigured()) {
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (err) {
    console.error(`Failed to delete asset ${publicId} from Cloudinary:`, err);
    return false;
  }
}
