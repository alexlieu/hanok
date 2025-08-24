import { tv } from "tailwind-variants";
import { fieldBorderStyles } from "./fieldBorderStyles";
import { focusRing } from "../utils";

export const fieldGroupStyles = tv({
  extend: focusRing,
  base: "group flex items-center overflow-hidden",
  variants: fieldBorderStyles.variants,
});
