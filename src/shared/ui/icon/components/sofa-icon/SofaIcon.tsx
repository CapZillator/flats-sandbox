import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function SofaIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7 4a3 3 0 0 0-3 3v1.18a3 3 0 0 0-3.43.18c-1.4.76-1.87 2.47-1.3 3.88l1.7 4.25A4 4 0 0 0 5 18.94V21h2v-2h10v2h2v-2.06a4 4 0 0 0 3.04-2.45l1.73-4.27a3.01 3.01 0 0 0-3.77-4.03V7a3 3 0 0 0-3-3H7Zm0 2h10a1 1 0 0 1 1 1v3.47L16.97 13H7.03L6 10.42V7a1 1 0 0 1 1-1Zm14.03 4c.18 0 .35.04.52.15.4.24.56.82.36 1.32l-1.73 4.27A2 2 0 0 1 18.32 17H5.68a2 2 0 0 1-1.86-1.26l-1.7-4.25c-.21-.53-.02-1.14.4-1.37.19-.1.37-.14.58-.12.34.04.71.34.88.76L5.68 15h12.64l1.77-4.37a1 1 0 0 1 .94-.63Z" />
    </svg>
  );
}
