import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function HeartIcon({
  filled = false,
  ...props
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 6c-1.8-2.1-4.81-2.75-7.06-.82-2.26 1.92-2.57 5.13-.8 7.4 1.47 1.89 5.92 5.87 7.38 7.16.17.14.25.21.35.24.08.03.17.03.25 0 .1-.03.18-.1.34-.24 1.46-1.29 5.92-5.27 7.39-7.16 1.77-2.27 1.49-5.5-.8-7.4C16.75 3.56 13.8 3.9 12 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
