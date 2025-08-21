import {
  FieldErrorProps,
  Group,
  GroupProps,
  InputProps,
  LabelProps,
  FieldError as RACFieldError,
  Input as RACInput,
  Label as RACLabel,
  Text,
  TextProps,
  composeRenderProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { composeTailwindRenderProps, focusRing } from "./utils";
import { forwardRef } from "react";

const labelStyles = tv({
  base: "text-sm text-black font-light cursor-default w-fit",
  variants: {
    isFocused:
      "peer-focus:underline peer-focus:underline-offset-2 peer-focus:decoration-3 peer-focus:decoration-brand-colour-3",
    isInvalid: "peer-focus:shadow-[0_2px_0_var(--color-brand-colour-3)]",
  },
});

export function Label(props: LabelProps) {
  return (
    <RACLabel
      {...props}
      className={twMerge(
        "text-sm text-black font-light cursor-default w-fit",
        props.className
      )}
    />
  );
}

export function Description(props: TextProps) {
  return (
    <Text
      {...props}
      slot="description"
      className={twMerge("text-sm text-gray-600", props.className)}
    />
  );
}

export function FieldError(props: FieldErrorProps) {
  return (
    <RACFieldError
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "text-error-red text-sm"
      )}
    />
  );
}

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

export const fieldGroupStyles = tv({
  extend: focusRing,
  base: "group flex items-center overflow-hidden",
  variants: fieldBorderStyles.variants,
});

export function FieldGroup(props: GroupProps) {
  return (
    <Group
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupStyles({ ...renderProps, className })
      )}
    />
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <RACInput
      {...props}
      ref={ref}
      className={composeTailwindRenderProps(props.className, "px-2 py-1.5")}
    />
  );
});
