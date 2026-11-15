import { z } from "zod";

export const updateBookingStatusSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
  newStatus: z.enum([
    "confirmed",
    "technician_en_route",
    "arrived",
    "in_progress",
    "completed",
    "cancelled",
    "disputed",
  ]),
  notes: z.string().max(300).optional().nullable(),
});

export const createReviewSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating cannot exceed 5"),
  reviewText: z.string().max(1000, "Review cannot exceed 1000 characters").optional().nullable(),
});

export const createDisputeSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
  issueType: z.enum([
    "poor_workmanship",
    "pricing_discrepancy",
    "technician_unprofessional",
    "damaged_property",
    "warranty_denial",
    "other",
  ]),
  description: z
    .string()
    .min(20, "Please describe the dispute in at least 20 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
});

export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateDisputeInput = z.infer<typeof createDisputeSchema>;
