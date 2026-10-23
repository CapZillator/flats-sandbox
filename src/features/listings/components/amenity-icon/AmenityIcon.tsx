import type { SVGProps } from "react";

import { CheckIcon } from "@/shared/ui/icon";
import { amenityIcons } from "../../lib/amenity-icons";

export function AmenityIcon({
  slug,
  ...props
}: SVGProps<SVGSVGElement> & { slug: string }) {
  const Icon = Object.hasOwn(amenityIcons, slug)
    ? amenityIcons[slug]
    : CheckIcon;

  return <Icon {...props} />;
}
