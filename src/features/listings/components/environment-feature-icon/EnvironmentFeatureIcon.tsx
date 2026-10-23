import type { SVGProps } from "react";

import { LocationIcon } from "@/shared/ui/icon";
import { environmentFeatureIcons } from "../../lib/environment-feature-icons";

export function EnvironmentFeatureIcon({
  slug,
  ...props
}: SVGProps<SVGSVGElement> & { slug: string }) {
  const Icon = Object.hasOwn(environmentFeatureIcons, slug)
    ? environmentFeatureIcons[slug]
    : LocationIcon;

  return <Icon {...props} />;
}
