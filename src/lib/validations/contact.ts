import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  phone: z
    .string()
    .min(10, "Please enter a valid 10-digit phone number")
    .max(15, "Phone number too long")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number format"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  projectType: z.string().min(1, "Please select a project type"),
  location: z.string().optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Please describe your project requirements in at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
  // Anti-spam honeypot field (must remain empty for humans)
  hp_website: z.string().optional().or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
