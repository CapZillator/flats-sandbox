import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function LocationIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 21c3.5-3.6 7-6.82 7-10.8A7.1 7.1 0 0 0 12 3a7.1 7.1 0 0 0-7 7.2C5 14.18 8.5 17.4 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
