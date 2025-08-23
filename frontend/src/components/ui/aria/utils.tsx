import { composeRenderProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export const focusRing = tv({
  base: "ring-brand-focus focus:outline-none ring-0 ring-offset-[2px] focus-within:ring-[2px]",
  variants: {
    isFocusVisible: {
      true: "ring-[2px] transition-shadow",
    },
  },
});

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tw, className));
}
