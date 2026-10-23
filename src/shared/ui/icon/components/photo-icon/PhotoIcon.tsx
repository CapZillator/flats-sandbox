import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function PhotoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M9.56 2a3 3 0 0 0-2.91 2.27L6.22 6H4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-2.22l-.43-1.73A3 3 0 0 0 14.44 2H9.56ZM8.59 4.76A1 1 0 0 1 9.56 4h4.88a1 1 0 0 1 .97.76l.43 1.73A2 2 0 0 0 17.78 8H20a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2.22a2 2 0 0 0 1.94-1.51l.43-1.73ZM12 18a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-2.01A2.99 2.99 0 1 1 12 10a2.99 2.99 0 0 1 0 5.99Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
