import mongoose, { Schema, Model } from "mongoose";

export interface IMilestoneDocument {
  title: string;
  description?: string;
  targetDate?: Date;
  completedDate?: Date;
  isCompleted: boolean;
}

export interface IProjectDocument extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  category: "residential" | "interior" | "commercial" | "renovation";
  location: string;
  coverImage: string;
  coverImagePublicId?: string;
  images: string[];
  imagesPublicIds?: string[];
  startDate: Date;
  expectedCompletionDate: Date;
  actualCompletionDate?: Date;
  status: "ongoing" | "completed";
  progressPercentage: number;
  milestones: IMilestoneDocument[];
  latestUpdate?: string;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestoneDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    targetDate: { type: Date },
    completedDate: { type: Date },
    isCompleted: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProjectDocument>(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: [true, "Project slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["residential", "interior", "commercial", "renovation"],
      required: [true, "Category is required"],
      index: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      default: "Bhopal, Madhya Pradesh",
    },
    coverImage: {
      type: String,
      required: [true, "Cover image URL is required"],
      trim: true,
    },
    coverImagePublicId: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    imagesPublicIds: {
      type: [String],
      default: [],
    },
    startDate: {
      type: Date,
      required: [true, "Project start date is required"],
    },
    expectedCompletionDate: {
      type: Date,
      required: [true, "Expected completion date is required"],
    },
    actualCompletionDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
      index: true,
    },
    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    milestones: {
      type: [MilestoneSchema],
      default: [],
    },
    latestUpdate: {
      type: String,
      trim: true,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for optimal querying
ProjectSchema.index({ status: 1, published: 1, createdAt: -1 });
ProjectSchema.index({ category: 1, published: 1 });
ProjectSchema.index({ featured: 1, published: 1 });

export const Project: Model<IProjectDocument> =
  mongoose.models.Project || mongoose.model<IProjectDocument>("Project", ProjectSchema);

export default Project;
