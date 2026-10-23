import type { SVGProps } from "react";

export function CouchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <g
        transform="translate(2 2) scale(.833333)"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12,8.2v5.73H5.32V12a1,1,0,0,0-1-.95h-1V8.2A2.87,2.87,0,0,1,6.27,5.34H9.14A2.87,2.87,0,0,1,12,8.2Z" />

        <path d="M21.55,11.07H19.64a1,1,0,0,0-1,.95v1.91H5.32V12a1,1,0,0,0-1-.95H2.45a1,1,0,0,0-1,.95v5.73h21V12A1,1,0,0,0,21.55,11.07Z" />

        <path d="M20.59,8.2v2.87h-.95a1,1,0,0,0-1,.95v1.91H12V8.2a2.87,2.87,0,0,1,2.86-2.86h2.87A2.87,2.87,0,0,1,20.59,8.2Z" />

        <line x1="2.45" y1="19.66" x2="2.45" y2="17.75" />

        <line x1="20.59" y1="19.66" x2="20.59" y2="17.75" />
      </g>
    </svg>
  );
}
