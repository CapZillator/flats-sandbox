import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function InfoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 1a11 11 0 1 1 0 22 11 11 0 0 1 0-22Zm0 2a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 6.5a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1ZM12 5.5A1.5 1.5 0 1 1 12 8a1.5 1.5 0 0 1 0-3Z" />
    </svg>
  );
}
