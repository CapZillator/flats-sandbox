import type { ComponentType, SVGProps } from "react";

import {
  SnowflakeIcon,
  BalconyIcon,
  BroomIcon,
  CookingPotIcon,
  DeskIcon,
  DumbbellIcon,
  ElevatorIcon,
  ParkingIcon,
  ShieldIcon,
  SwimmingPoolIcon,
  WashingMachineIcon,
  WifiRouterIcon,
} from "@/shared/ui/icon";

export const amenityIcons: Readonly<
  Record<string, ComponentType<SVGProps<SVGSVGElement>>>
> = {
  wifi: WifiRouterIcon,
  "air-conditioning": SnowflakeIcon,
  "washing-machine": WashingMachineIcon,
  kitchen: CookingPotIcon,
  balcony: BalconyIcon,
  parking: ParkingIcon,
  gym: DumbbellIcon,
  elevator: ElevatorIcon,
  security: ShieldIcon,
  workspace: DeskIcon,
  "swimming-pool": SwimmingPoolIcon,
  "cleaning-service": BroomIcon,
};
