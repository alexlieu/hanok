import {
  Radio as RACRadio,
  RadioGroup as RACRadioGroup,
  RadioGroupProps as RACRadioGroupProps,
  RadioProps,
  ValidationResult,
} from "react-aria-components";
import { Description, FieldError } from "./Field";
import { composeTailwindRenderProps, focusRing } from "./utils";
import { ReactNode } from "react";
import { tv } from "tailwind-variants";
import { createLabel } from "./utils/createLabel";

// A default function (an empty no-op function in this case) is used in case a component tries to consume the context before
// a <Provider> higher up in the component tree exists.
// By using an empty function, the call is valid and simply does nothing.
// But if setIsPressed was null or undefined it would result in a type error.
// The default value must match the TypeScript type defined for the context.
// Since isPressed is a function, the default value must be a function even if it is an empty one.

// const RadioGroupContext = createContext<{
//   setIsPressed: (isPressed: boolean) => void;
// }>({ setIsPressed: () => {} });

export interface RadioGroupProps extends Omit<RACRadioGroupProps, "children"> {
  label?: string;
  children?: ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function RadioGroup({
  label,
  isRequired,
  children,
  description,
  errorMessage,
  ...props
}: RadioGroupProps) {
  return (
    <RACRadioGroup
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-2"
      )}
    >
      {createLabel({
        label,
        isRequired,
      })}
      <div className="flex gap-2 group-orientation-vertical:flex-col group-orientation-horizontal:gap-4">
        {children}
      </div>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </RACRadioGroup>
  );
}

const styles = tv({
  extend: focusRing,
  base: "w-5 h-5 border-2 border-brand-colour-5 transition-all",
  variants: {
    isSelected: {
      false: "group-pressed:bg-cyan-300",
      true: "bg-cyan-700",
    },
    isInvalid: {
      true: "border-error-red",
    },
    isDisabled: {
      true: "border-unavailable",
    },
  },
});

export function Radio({ className, children, ...props }: RadioProps) {
  return (
    <RACRadio
      {...props}
      className={composeTailwindRenderProps(
        className,
        "flex relative gap-3 items-center group text-sm transition"
      )}
    >
      {(renderProps) => (
        <>
          <div className={styles(renderProps)} />
          {children}
        </>
      )}
    </RACRadio>
  );
}
