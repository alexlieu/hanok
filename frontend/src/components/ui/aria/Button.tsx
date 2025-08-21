import { tv } from "tailwind-variants";
import {
  composeRenderProps,
  Button as RACButton,
  ButtonProps as RACButtonProps,
} from "react-aria-components";
import { focusRing } from "./utils";

export interface ButtonProps extends RACButtonProps {
  /** @default 'primary' */
  variant?: "primary" | "secondary" | "icon";
}

let button = tv({
  extend: focusRing,
  base: "px-5 py-2 text-sm text-center focus:ring-offset-[2px] focus:outline-none focus:relative focus:z-100 transition border border-2 border-black/10",
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
    />
  );
};
