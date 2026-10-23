import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function UploadIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 8v8m3-5-2.91-2.91a.13.13 0 0 0-.18 0L9 11M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
