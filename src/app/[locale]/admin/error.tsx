"use client";
import { ModerationError } from "@/features/admin/components/moderation-error/ModerationError";

export default function Error({ retry }: { retry: () => void }) {
  return <ModerationError retry={retry} />;
}
