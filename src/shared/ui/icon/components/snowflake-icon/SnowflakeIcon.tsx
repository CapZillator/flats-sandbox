import type { SVGProps } from "react";

export function SnowflakeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 9V15M12 9L16 5M12 9L8 5M12 9V3M12 15L16 19M12 15L8 19M12 15V21M3 12H9M21 12H15M5 8L9 12M9 12L5 16M9 12H15M15 12L19 8M15 12L19 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
