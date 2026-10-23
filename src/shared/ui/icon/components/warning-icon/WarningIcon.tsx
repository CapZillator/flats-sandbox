import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function WarningIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 9v4m0 4h.01M10.3 4.9 2.6 18.2A1.2 1.2 0 0 0 3.64 20h16.72a1.2 1.2 0 0 0 1.04-1.8L13.7 4.9a1.96 1.96 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
