import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function SuccessIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm3.3 4.3a1 1 0 0 1 1.4 1.4l-6 6a1 1 0 0 1-1.4 0l-2-2a1 1 0 0 1 1.4-1.4l1.3 1.29 5.3-5.3Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
