import mongoose, { Schema, Model } from "mongoose";

export interface IServiceDocument extends mongoose.Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  deliverables: string[];
  icon: string;
  coverImage?: string;
  coverImagePublicId?: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IServiceDocument>(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: [true, "Service slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: 300,
    },
    fullDescription: {
      type: String,
      trim: true,
    },
    deliverables: {
      type: [String],
      default: [],
    },
    icon: {
      type: String,
      default: "Home",
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    coverImagePublicId: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    published: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

ServiceSchema.index({ published: 1, order: 1 });

export const Service: Model<IServiceDocument> =
  mongoose.models.Service || mongoose.model<IServiceDocument>("Service", ServiceSchema);

export default Service;
