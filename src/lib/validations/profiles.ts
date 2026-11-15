import { z } from "zod";

export const customerProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be under 100 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  avatarUrl: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
});

export const technicianProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be under 100 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  businessName: z.string().max(120, "Business name cannot exceed 120 characters").optional(),
  experienceYears: z
    .number()
    .int()
    .min(1, "Experience must be at least 1 year")
    .max(50, "Experience cannot exceed 50 years"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  serviceRadiusKm: z
    .number()
    .min(1, "Radius must be at least 1 km")
    .max(50, "Radius cannot exceed 50 km")
    .default(15),
  availabilityStatus: z.boolean().default(true),
});

export const customerAddressSchema = z.object({
  addressLine: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(250, "Address is too long"),
  area: z.string().min(2, "Bengaluru locality/area is required"),
  city: z.string().default("Bengaluru"),
  state: z.string().default("Karnataka"),
  pincode: z
    .string()
    .regex(/^560\d{3}$/, "Please enter a valid 6-digit Bengaluru pincode starting with 560"),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  isDefault: z.boolean().default(false),
});

export type CustomerProfileInput = z.infer<typeof customerProfileSchema>;
export type TechnicianProfileInput = z.infer<typeof technicianProfileSchema>;
export type CustomerAddressInput = z.infer<typeof customerAddressSchema>;
