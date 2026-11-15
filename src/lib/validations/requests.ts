import { z } from "zod";

export const createServiceRequestSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  addressId: z.string().uuid("Invalid address ID"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title cannot exceed 120 characters"),
  description: z
    .string()
    .min(10, "Please provide at least 10 characters describing the fault")
    .max(1000, "Description cannot exceed 1000 characters"),
  problemDetails: z.record(z.string(), z.any()).optional().default({}),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Preferred date must be in YYYY-MM-DD format"),
  preferredTime: z.string().min(2, "Preferred time slot is required"),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

export const updateRequestStatusSchema = z.object({
  requestId: z.string().uuid("Invalid request ID"),
  status: z.enum([
    "draft",
    "open",
    "quoted",
    "booked",
    "in_progress",
    "completed",
    "cancelled",
    "expired",
  ]),
});

export type CreateServiceRequestInput = z.infer<typeof createServiceRequestSchema>;
export type UpdateRequestStatusInput = z.infer<typeof updateRequestStatusSchema>;
