import { tv } from "tailwind-variants";

export const selectButtonStyles = tv({
  base: "flex items-center text-start gap-4 w-full cursor-default px-2 py-1.5 outline-hidden",
  variants: {
    isDisabled: {
      false: "text-gray-800 hover:bg-gray-100 group-invalid:border-error-red",
      true: "text-disabled-text",
    },
    isFocused: {
      true: "", // "ring-[2px] ring-brand-focus outline-none transition-shadow",
    },
  },
});
