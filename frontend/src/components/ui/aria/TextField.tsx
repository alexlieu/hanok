import { forwardRef } from "react";
import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
} from "react-aria-components";
import {
  Description,
  fieldBorderStyles,
  FieldError,
  Input,
  Label,
} from "./Field";
import { tv } from "tailwind-variants";
import { composeTailwindRenderProps, focusRing } from "./utils";

const inputStyles = tv({
  extend: focusRing,
  base: "border-2 border-brand-colour-5 focus:ring-offset-[2px] outline-none",
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    isInvalid: fieldBorderStyles.variants.isInvalid,
    isDisabled: fieldBorderStyles.variants.isDisabled,
  },
});

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      description,
      errorMessage,
      isInvalid,
      value,
      onBlur,
      onChange,
      ...props
    },
    ref
  ) => {
    return (
      <AriaTextField
        {...props}
        className={composeTailwindRenderProps(
          props.className,
          "flex flex-col gap-1"
        )}
        onBlur={onBlur}
        onChange={onChange}
        value={value}
        isInvalid={isInvalid}
      >
        {label && (
          <Label>
            {label}
            <span className="text-error-red pl-1/2">
              {props.isRequired ? "*" : ""}
            </span>
          </Label>
        )}
        <Input
          ref={ref}
          className={composeTailwindRenderProps(inputStyles, "peer")}
        />
        {description && <Description>{description}</Description>}
        <FieldError>{errorMessage}</FieldError>
      </AriaTextField>
    );
  }
);
