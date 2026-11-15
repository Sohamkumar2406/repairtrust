import { z } from "zod";

export const quoteItemSchema = z.object({
  itemName: z.string().min(2, "Item name is required").max(120),
  description: z.string().max(250).optional().nullable(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
  unitPrice: z.number().min(0, "Unit price cannot be negative"),
  totalPrice: z.number().min(0, "Total price cannot be negative"),
});

export const createQuoteSchema = z.object({
  requestId: z.string().uuid("Invalid request ID"),
  labourCost: z.number().min(0, "Labour cost cannot be negative"),
  partsCost: z.number().min(0, "Parts cost cannot be negative").default(0),
  inspectionCost: z.number().min(0, "Inspection cost cannot be negative").default(0),
  taxAmount: z.number().min(0, "Tax cannot be negative").default(0),
  additionalCharges: z.number().min(0, "Additional charges cannot be negative").default(0),
  totalAmount: z.number().min(50, "Total quote must be at least ₹50"),
  estimatedCompletionTime: z.string().min(2, "Estimated completion time is required"),
  validityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Validity date must be YYYY-MM-DD"),
  terms: z.string().max(500).optional().nullable(),
  items: z.array(quoteItemSchema).optional().default([]),
});

export const acceptQuoteSchema = z.object({
  quoteId: z.string().uuid("Invalid quote ID"),
  scheduledAt: z.string().datetime("Valid ISO 8601 scheduled timestamp required"),
});

export type QuoteItemInput = z.infer<typeof quoteItemSchema>;
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type AcceptQuoteInput = z.infer<typeof acceptQuoteSchema>;
