import type { SVGProps } from "react";

export function MoneyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="4" y="6" width="14" height="10" rx="2" />

      <path d="M21 9v8a2 2 0 0 1-2 2H7" />

      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}
