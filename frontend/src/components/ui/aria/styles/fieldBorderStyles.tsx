import { tv } from "tailwind-variants";

export const fieldBorderStyles = tv({
  variants: {
    isFocusWithin: {
      false: "",
      true: "border-brand-colour-4",
    },
    isInvalid: {
      true: "border-error-red",
    },
    isDisabled: {
      true: "border-unavailable text-disabled-text",
    },
  },
  compoundVariants: [
    {
      isFocusWithin: true,
      isInvalid: true,
      className: "border-error-red",
    },
  ],
});
