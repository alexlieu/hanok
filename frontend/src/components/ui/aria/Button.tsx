import { tv } from "tailwind-variants";
import {
  composeRenderProps,
  Button as RACButton,
  ButtonProps as RACButtonProps,
} from "react-aria-components";
import { Ref } from "react";
import { focusRing, getFocusRingClasses } from "./utils";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends RACButtonProps {
  /** @default 'primary' */
  variant?: "primary" | "secondary" | "icon";
  ref?: Ref<HTMLButtonElement>;
  invisibleOnDisabled?: boolean;
}

const button = tv({
  extend: focusRing,
  base: "px-5 py-2 text-sm text-center border border-2 border-brand-colour-5",
  variants: {
    variant: {
      primary: "",
      secondary:
        "text-black bg-transparent hover:bg-black hover:text-default-bg hover:border-black",
      icon: "border-0 p-1 flex items-center justify-center text-brand-colour-5 hover:bg-icon-pressed hover:text-default-bg",
    },
    isDisabled: {
      true: "bg-unavailable",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
  compoundVariants: [
    {
      variant: "icon",
      isDisabled: true,
      className: "text-icon-disabled bg-icon-disabled-bg",
    },
  ],
});

export const Button = (props: ButtonProps) => {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(
        props.className,
        (className, renderProps) => {
          const variantOffset = props.variant === "icon" && "ring-offset-0";
          const focusClasses = getFocusRingClasses(
            renderProps.isFocusVisible,
            variantOffset ? variantOffset : undefined
          );
          const invisibleClass =
            renderProps.isDisabled && props.invisibleOnDisabled
              ? "invisible transition-none"
              : "";
          return twMerge(
            button({
              ...renderProps,
              variant: props.variant,
              className,
            }),
            focusClasses,
            invisibleClass
          );
        }
      )}
      ref={props.ref}
    />
  );
};
