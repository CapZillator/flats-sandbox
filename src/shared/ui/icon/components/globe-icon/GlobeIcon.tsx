import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function GlobeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" />

      <path
        d="M2.5 12h19M12 2.5c1.93 0 3.5 4.25 3.5 9.5s-1.57 9.5-3.5 9.5S8.5 17.25 8.5 12 10.07 2.5 12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
