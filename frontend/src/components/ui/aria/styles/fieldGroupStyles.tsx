import { tv } from "tailwind-variants";
import { fieldBorderStyles } from "./fieldBorderStyles";
import { focusRing } from "../utils";

export const fieldGroupStyles = tv({
  extend: focusRing,
  base: "group flex items-center overflow-hidden border-2 border-brand-colour-5",
  variants: fieldBorderStyles.variants,
  compoundVariants: fieldBorderStyles.compoundVariants,
});
