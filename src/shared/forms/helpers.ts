import type { ReactNode } from "react";

import { getFieldDescriptionIds } from "@/shared/ui";

export function mergeDescriptionIds({
  describedBy,
  error,
  hint,
  inputId,
}: {
  describedBy?: string;
  error?: string;
  hint?: ReactNode;
  inputId: string;
}): string | undefined {
  return (
    [describedBy, getFieldDescriptionIds({ error, hint, inputId })]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

export function makeFieldId(reactId: string): string {
  return `field-${reactId.replaceAll(":", "")}`;
}
