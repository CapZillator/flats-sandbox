import type { SVGProps } from "react";

export function BroomIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <g
        transform="translate(1.333333 1.333333) scale(.666667)"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M14,17V3c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2v14" />

        <line x1="14" y1="14" x2="18" y2="14" />

        <path d="M26,31H6l2.7-12.4c0.2-0.9,1-1.6,2-1.6h10.8c0.9,0,1.8,0.7,2,1.6L26,31z" />

        <line x1="9" y1="21" x2="23" y2="21" />

        <line x1="11" y1="27" x2="11" y2="30" />

        <line x1="21" y1="29" x2="21" y2="30" />
      </g>
    </svg>
  );
}
