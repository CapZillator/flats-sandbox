import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function TargetIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M11 2a1 1 0 1 1 2 0v2.06A8 8 0 0 1 19.94 11H22a1 1 0 1 1 0 2h-2.06A8 8 0 0 1 13 19.94V22a1 1 0 1 1-2 0v-2.06A8 8 0 0 1 4.06 13H2a1 1 0 1 1 0-2h2.06A8 8 0 0 1 11 4.06V2Zm7 10a6 6 0 1 0-12 0 6 6 0 0 0 12 0Zm-3 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
