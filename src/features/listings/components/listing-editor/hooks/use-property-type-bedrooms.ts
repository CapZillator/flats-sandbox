import { useEffect, useRef } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import type { ListingFormValues } from "../listing-form.schema";

export function usePropertyTypeBedrooms({
  control,
  setValue,
}: Pick<UseFormReturn<ListingFormValues>, "control" | "setValue">) {
  const propertyType = useWatch({ control, name: "propertyType" });
  const previousPropertyType = useRef(propertyType);
  const isStudio = propertyType === "STUDIO";

  useEffect(() => {
    const changed = previousPropertyType.current !== propertyType;
    previousPropertyType.current = propertyType;

    if (!changed && !isStudio) {
      return;
    }

    setValue("bedrooms", isStudio ? "0" : "1", {
      shouldDirty: changed,
      shouldValidate: changed,
    });
  }, [isStudio, propertyType, setValue]);

  return isStudio;
}
