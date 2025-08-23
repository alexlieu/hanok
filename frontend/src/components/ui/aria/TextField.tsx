import { forwardRef, useState } from "react";
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

export const inputStyles = tv({
  extend: focusRing,
  base: "border-2 border-brand-colour-5 outline-none text-sm",
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
  placeholder?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      description,
      errorMessage,
      placeholder,
      isInvalid,
      value,
      onBlur,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
      <AriaTextField
        {...props}
        className={composeTailwindRenderProps(
          props.className,
          "flex flex-col gap-1"
        )}
        onFocusChange={(isFocused) => setIsFocused(isFocused)}
        value={value}
        isInvalid={isInvalid}
      >
        {label && (
          <Label>
            <span
              className={`${
                isFocused && "overline decoration-3 decoration-brand-colour-3"
              }`}
            >
              {label}
            </span>
            {props.isRequired && (
              <span className="ml-0.5 text-error-red">*</span>
            )}
          </Label>
        )}
        <Input
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={inputStyles}
        />
        {description && <Description>{description}</Description>}
        <FieldError>{errorMessage}</FieldError>
      </AriaTextField>
    );
  }
);
