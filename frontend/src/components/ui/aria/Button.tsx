import { tv } from "tailwind-variants";
import {
  composeRenderProps,
  Button as RACButton,
  ButtonProps as RACButtonProps,
} from "react-aria-components";
import { focusRing } from "./utils";
import { Ref } from "react";

export interface ButtonProps extends RACButtonProps {
  /** @default 'primary' */
  variant?: "primary" | "secondary" | "icon";
  ref?: Ref<HTMLButtonElement>;
}

const button = tv({
  extend: focusRing,
  base: "px-5 py-2 text-sm text-center border border-2 border-black/10",
  variants: {
    variant: {
      primary: "",
      secondary: "text-black bg-white hover:bg-black hover:text-white",
      icon: "border-0 p-1 flex items-center justify-center text-gray-600 hover:bg-black/10 pressed:bg-black/15 disabled:bg-transparent",
    },
    isDisabled: {
      true: "bg-stone-700",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export const Button = (props: ButtonProps) => {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        button({ ...renderProps, variant: props.variant, className })
      )}
      ref={props.ref}
    />
  );
};
