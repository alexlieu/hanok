import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  CheckboxGroupProps as AriaCheckboxGroupProps,
  CheckboxProps,
  ValidationResult,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Description, FieldError } from "./Field";
import { composeTailwindRenderProps, focusRing } from "./utils";
import { createContext, ReactNode, useContext, useState } from "react";
import { createLabel } from "./utils/createLabel";
import { LuMinus as Minus, LuCheck as Check } from "react-icons/lu";

const CheckboxGroupContext = createContext<{
  setIsPressed: (isPressed: boolean) => void;
}>({ setIsPressed: () => {} });

export interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, "children"> {
  label?: string;
  children?: ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function CheckboxGroup({
  className,
  label,
  isRequired,
  children,
  description,
  errorMessage,
  ...props
}: CheckboxGroupProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  return (
    <AriaCheckboxGroup
      {...props}
      className={composeTailwindRenderProps(className, "flex flex-col gap-2")}
      onFocusChange={setIsFocused}
    >
      {createLabel({
        label,
        isRequired,
        isFocused: !!(isFocused || isPressed),
      })}
      <CheckboxGroupContext.Provider value={{ setIsPressed }}>
        {children}
      </CheckboxGroupContext.Provider>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
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
  base: "w-5 h-5 shrink-0 flex items-center justify-center border-2 transition",
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

const iconStyles = "w-4 h-4 text-black group-disabled:text-unavailable-text";

export function Checkbox(props: CheckboxProps) {
  const { setIsPressed } = useContext(CheckboxGroupContext);
  return (
    <AriaCheckbox
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        checkboxStyles({ ...renderProps, className })
      )}
      onPressChange={setIsPressed}
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
