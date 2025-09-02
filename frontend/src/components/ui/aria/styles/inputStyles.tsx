import { tv } from "tailwind-variants";
import { fieldBorderStyles } from "./fieldBorderStyles";
import { focusRing } from "../utils";

export const inputStyles = tv({
  extend: focusRing,
  base: "border-2 border-brand-colour-5 text-sm",
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    isInvalid: fieldBorderStyles.variants.isInvalid,
    isDisabled: fieldBorderStyles.variants.isDisabled,
  },
  compoundVariants: [
    {
      isFocused: true,
      isInvalid: true,
      className: "outline-transparent focus:outline-transparent",
    },
  ],
});
