import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ListIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9 6h12M9 12h12M9 18h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <rect x="3" y="4" width="3" height="3" rx=".5" fill="currentColor" />

      <rect x="3" y="10.5" width="3" height="3" rx=".5" fill="currentColor" />

      <rect x="3" y="17" width="3" height="3" rx=".5" fill="currentColor" />
    </svg>
  );
}
