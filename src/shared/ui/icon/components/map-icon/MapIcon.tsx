import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function MapIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.72 1.52a3 3 0 0 1 2.53-.07l4.93 2.11A3 3 0 0 1 23 6.32v12.65a3 3 0 0 1-4.18 2.76l-3.36-1.45a1 1 0 0 0-.84.03l-4.34 2.17a3 3 0 0 1-2.53.07l-4.93-2.11A3 3 0 0 1 1 17.68V5.03a3 3 0 0 1 4.18-2.75l3.36 1.44a1 1 0 0 0 .84-.03l4.34-2.17ZM16 3.52v14.83l.25.1 3.36 1.44a1 1 0 0 0 1.39-.92V6.32a1 1 0 0 0-.61-.92L16 3.52Zm-2 .1-3.72 1.86-.28.12v14.78l3.72-1.86.28-.12V3.62ZM8 5.65l-.25-.1-3.36-1.44A1 1 0 0 0 3 5.03v12.65a1 1 0 0 0 .61.92L8 20.48V5.65Z" />
    </svg>
  );
}
