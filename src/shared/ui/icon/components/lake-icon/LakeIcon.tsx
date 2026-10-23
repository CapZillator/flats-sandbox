import type { SVGProps } from "react";

export function LakeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 12c0 4-4 7-9 7s-9-2-9-5c0-2 2-3 3-4s0-3 3-4c2-1 4 1 6 1s6 1 6 5Z" />

      <path d="M9 11c1 .8 2 .8 3 0s2-.8 3 0M8 15c1 .8 2 .8 3 0s2-.8 3 0" />
    </svg>
  );
}
