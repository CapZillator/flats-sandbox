import type { ComponentType, SVGProps } from "react";

import {
  BeachIcon,
  ForestIcon,
  LakeIcon,
  MountainsIcon,
  RiverIcon,
  SeaWavesIcon,
} from "@/shared/ui/icon";

export const environmentFeatureIcons: Readonly<
  Record<string, ComponentType<SVGProps<SVGSVGElement>>>
> = {
  sea: SeaWavesIcon,
  beach: BeachIcon,
  mountains: MountainsIcon,
  forest: ForestIcon,
  river: RiverIcon,
  lake: LakeIcon,
};
