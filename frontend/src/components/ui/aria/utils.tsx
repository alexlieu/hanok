import { composeRenderProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export const focusRing = tv({
  base: "ring-brand-focus focus:outline-none ring-offset-[2px] ring-offset-default-bg transition-shadow",
  variants: {
    isFocusVisible: {
      true: "ring-[2px]",
    },
    useFocusWithin: {
      true: " focus-within:ring-[2px]",
    },
  },
  defaultVariants: { useFocusWithin: true },
});

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tw, className));
}
