import { composeRenderProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export const focusRing = tv({
  base: "outline-hidden forced-colors:outline-[Hightlight] ring-brand-focus ring-offset-[2px] ring-offset-default-bg transition",
  variants: {
    isFocusVisible: {
      true: "ring-[2px]",
    },
  },
});

export function getFocusRingClasses(
  isFocusVisible: boolean,
  offsetOverride?: string
) {
  const baseClasses = focusRing({ isFocusVisible });
  if (offsetOverride) {
    return twMerge(baseClasses, offsetOverride);
  }
  return baseClasses;
}

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tw, className));
}
