import type { SVGProps } from "react";

export function BedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <g
        transform="translate(2 2) scale(.833333)"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M2.45 23.45v-2.86m19.1 2.86v-2.86M4.36.55v2.86M19.64.55v2.86" />

        <path d="M4.36 3.41h15.27v7.64H4.36z" />

        <path d="M7.23 7.23h1.91A2.86 2.86 0 0 1 12 10.09v1H4.36v-1a2.86 2.86 0 0 1 2.87-2.86Zm7.63 0h1.91a2.86 2.86 0 0 1 2.86 2.86v1H12v-1a2.86 2.86 0 0 1 2.86-2.86Z" />

        <path d="M6.52 11h11a4.07 4.07 0 0 1 4.07 4.07v.7H2.45v-.7A4.07 4.07 0 0 1 6.52 11Z" />

        <path d="M1.5 15.82h21v4.77h-21z" />
      </g>
    </svg>
  );
}
