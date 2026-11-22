import mongoose, { Schema, Model } from "mongoose";

export interface IContactEnquiryDocument extends mongoose.Document {
  name: string;
  phone: string;
  email?: string;
  projectType: string;
  message: string;
  location?: string;
  status: "new" | "reviewed" | "contacted" | "resolved" | "archived";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactEnquirySchema = new Schema<IContactEnquiryDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    projectType: {
      type: String,
      required: [true, "Project type is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 2000,
    },
    location: {
      type: String,
      trim: true,
      default: "Bhopal",
    },
    status: {
      type: String,
      enum: ["new", "reviewed", "contacted", "resolved", "archived"],
      default: "new",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

ContactEnquirySchema.index({ status: 1, createdAt: -1 });

export const ContactEnquiry: Model<IContactEnquiryDocument> =
  mongoose.models.ContactEnquiry ||
  mongoose.model<IContactEnquiryDocument>("ContactEnquiry", ContactEnquirySchema);

export default ContactEnquiry;
