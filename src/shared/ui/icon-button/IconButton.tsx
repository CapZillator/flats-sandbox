import type { ButtonHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

import {
  getButtonClassName,
  type ButtonSize,
  type ButtonVariant,
} from "@/shared/ui/button/button.styles";

type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "children"
> & {
  "aria-label": string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: "rectangle" | "circle";
};

export function IconButton({
  children,
  className,
  shape = "rectangle",
  size = "md",
  type = "button",
  variant,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={classNames(
        getButtonClassName({
          variant,
          size,
          iconOnly: true,
          shape: shape === "circle" ? "circle" : "control",
        }),
        className,
      )}
    >
      {children}
    </button>
  );
}
