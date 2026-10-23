import type { AnchorHTMLAttributes } from "react";

import {
  getButtonClassName,
  type ButtonSize,
  type ButtonVariant,
} from "@/shared/ui/button/button.styles";

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function ButtonLink({
  children,
  className,
  fullWidth,
  size,
  variant,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      {...props}
      className={getButtonClassName({
        variant,
        size,
        fullWidth,
        className,
      })}
    >
      {children}
    </a>
  );
}
