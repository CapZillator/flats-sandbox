import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function DeleteIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 7h16M6 7v11a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
