import type { SVGProps } from "react";

export function BathroomIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <g
        transform="translate(2 2) scale(.833333)"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M2.42 13.94h19.16v.96a5.75 5.75 0 0 1-5.75 5.75H8.17a5.75 5.75 0 0 1-5.75-5.75v-.96Z" />

        <path d="M4.33 23.52v-.96l1.92-1.91m13.42 2.87v-.96l-1.92-1.91" />

        <path d="M2.42 13.94V3.87a2.39 2.39 0 0 1 2.39-2.39 2.39 2.39 0 0 1 2.4 2.39v1.44" />

        <path d="M5.29 5.31h3.84M.5 13.94h23" />
      </g>
    </svg>
  );
}
