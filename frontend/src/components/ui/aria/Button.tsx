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
  variant?: "primary" | "secondary" | "icon" | "iconNoInteraction";
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
        "text-black bg-transparent enabled:hover:bg-black enabled:hover:text-default-bg enabled:hover:border-black",
      icon: "border-0 p-1 flex items-center justify-center text-brand-colour-5 hover:bg-icon-hover hover:text-default-bg pressed:scale-90 pressed:transition-transform",
      iconNoInteraction:
        "border-0 p-1 flex items-center justify-center focus-visible:ring-offset-0",
    },
    isDisabled: {
      true: "",
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

export const Button = ({
  invisibleOnDisabled = false,
  ...props
}: ButtonProps) => {
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
            renderProps.isDisabled && invisibleOnDisabled === true
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
