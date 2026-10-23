import { z } from "zod";
export const moderationListingIdSchema = z.uuid();

export const moderationStatuses = [
  "PENDING_REVIEW",
  "PUBLISHED",
  "REJECTED",
  "DRAFT",
  "ARCHIVED",
] as const;
export function rejectionSchema(message: string) {
  return z.object({
    reason: z.string().trim().min(5, message).max(1000, message),
  });
}
