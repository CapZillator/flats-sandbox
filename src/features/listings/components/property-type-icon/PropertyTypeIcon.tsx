import type { SVGProps } from "react";

import type { PropertyType } from "@/shared/api/types";
import {
  ApartmentIcon,
  HouseIcon,
  ServicedApartmentIcon,
  StudioIcon,
  VillaIcon,
} from "@/shared/ui/icon";

const propertyTypeIcons = {
  APARTMENT: ApartmentIcon,
  HOUSE: HouseIcon,
  SERVICED_APARTMENT: ServicedApartmentIcon,
  STUDIO: StudioIcon,
  VILLA: VillaIcon,
} satisfies Record<PropertyType, typeof ApartmentIcon>;

export function PropertyTypeIcon({
  type,
  ...props
}: SVGProps<SVGSVGElement> & { type: PropertyType }) {
  const Icon = propertyTypeIcons[type];

  return <Icon {...props} />;
}
