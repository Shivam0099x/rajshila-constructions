import mongoose, { Schema, Model } from "mongoose";

export interface IGalleryImageDocument extends mongoose.Document {
  title: string;
  description?: string;
  imageUrl: string;
  publicId?: string;
  category: "living" | "bedroom" | "kitchen" | "bathroom" | "commercial" | "other" | "construction";
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImageDocument>(
  {
    title: {
      type: String,
      required: [true, "Image title is required"],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    publicId: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["living", "bedroom", "kitchen", "bathroom", "commercial", "other", "construction"],
      required: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    published: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

GalleryImageSchema.index({ category: 1, published: 1, order: 1 });

export const GalleryImage: Model<IGalleryImageDocument> =
  mongoose.models.GalleryImage ||
  mongoose.model<IGalleryImageDocument>("GalleryImage", GalleryImageSchema);

export default GalleryImage;
