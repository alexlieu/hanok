import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import { selectButtonStyles as defaultSelectButtonStyles } from "./selectButtonStyles";
import { inputStyles } from "./inputStyles";

export const borderedSelectButtonStyles = tv({
  extend: defaultSelectButtonStyles,
  base: twMerge(
    inputStyles.base,
    "h-fit focus:border-brand-colour-4 focus-visible:ring-[2px] focus-visible:ring-offset-default-bg focus-visible:ring-offset-[2px] focus-visible:transition-shadow focus-visible:ring-brand-focus"
  ),
  variants: {
    isDisabled: { true: "border-unavailable" },
  },
});
