import { tv } from "tailwind-variants";

export const fieldBorderStyles = tv({
  variants: {
    isFocusWithin: {
      false: "",
      true: "",
    },
    isInvalid: {
      true: "border-error-red",
    },
    isDisabled: {
      true: "bg-unavailable",
    },
  },
});
