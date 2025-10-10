import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  CheckboxGroupProps as AriaCheckboxGroupProps,
  CheckboxProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { AnimatedFieldError, Description } from "./Field";
import { composeTailwindRenderProps, focusRing } from "./utils";
import { ReactNode } from "react";
import { createLabel } from "./utils/createLabel";
import { LuMinus as Minus, LuCheck as Check } from "react-icons/lu";
import { RefCallBack } from "react-hook-form";

export interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, "children"> {
  label?: string;
  children?: ReactNode;
  description?: string;
  errorMessage?: string;
  inputRef?: RefCallBack;
}

export function CheckboxGroup({
  className,
  label,
  isRequired,
  children,
  description,
  errorMessage,
  value,
  onChange,
  onBlur,
  inputRef,
  ...props
}: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup
      {...props}
      className={composeTailwindRenderProps(className, "flex flex-col gap-2")}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      ref={inputRef}
    >
      {createLabel({ label, isRequired })}
      {Array.isArray(children) ? (
        children.length <= 4 ? (
          <span className="flex flex-row gap-5">{children}</span>
        ) : (
          children
        )
      ) : (
        children
      )}
      {description && <Description>{description}</Description>}
      <AnimatedFieldError isInvalid={props.isInvalid} children={errorMessage} />
    </AriaCheckboxGroup>
  );
}

const checkboxStyles = tv({
  base: "flex gap-2 items-center text-sm transition relative",
  variants: {
    isDisabled: {
      false: "text-gray-800",
      true: "text-gray-300",
    },
  },
});

const boxStyles = tv({
  extend: focusRing,
  base: "w-5 h-5 shrink-0 flex items-center justify-center border-2 border-brand-colour-5 transition",
  variants: {
    isSelected: {
      false: "bg-transparent",
      true: "bg-stone-200",
    },
    isInvalid: {
      true: "border-error-red",
    },
    isDisabled: {
      true: "[--color:var(--color-unavailable)]",
    },
  },
});

const iconStyles =
  "w-4 h-4 text-brand-colour-5 group-disabled:text-unavailable-text";

export function Checkbox(props: CheckboxProps) {
  return (
    <AriaCheckbox
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        checkboxStyles({ ...renderProps, className })
      )}
    >
      {({ isSelected, isIndeterminate, ...renderProps }) => (
        <>
          <div
            className={boxStyles({
              isSelected: isSelected || isIndeterminate,
              ...renderProps,
            })}
          >
            {isIndeterminate ? (
              <Minus aria-hidden className={iconStyles} />
            ) : isSelected ? (
              <Check aria-hidden className={iconStyles} />
            ) : null}
          </div>
          {props.children}
        </>
      )}
    </AriaCheckbox>
  );
}
