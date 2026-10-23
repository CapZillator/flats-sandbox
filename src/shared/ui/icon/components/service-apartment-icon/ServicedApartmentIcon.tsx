import type { SVGProps } from "react";

export function ServicedApartmentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <g
        transform="translate(2.4 2.4) scale(.8)"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="4.37" r="2.87" />

        <path d="M12,7.24h0A4.78,4.78,0,0,1,16.78,12v1a0,0,0,0,1,0,0H7.22a0,0,0,0,1,0,0V12A4.78,4.78,0,0,1,12,7.24Z" />

        <line x1="23.48" y1="12.98" x2="0.52" y2="12.98" />

        <polyline points="3.39 23.5 3.39 12.98 20.61 12.98 20.61 23.5" />

        <rect x="7.22" y="16.8" width="9.57" height="3.83" />
      </g>
    </svg>
  );
}
