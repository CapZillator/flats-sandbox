import type { SVGProps } from "react";

export function VillaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <g
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="12" y="16" width="4" height="5" />

        <path d="M4,3.17V11H20V5.83ZM8,21H20V11H8ZM4,11V21" />

        <polyline points="3 3 4 3.17 20 5.83 21 6" />
      </g>
    </svg>
  );
}
