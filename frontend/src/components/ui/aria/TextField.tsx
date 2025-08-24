import { useState } from "react";
import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
} from "react-aria-components";
import { Description, FieldError, Input, Label } from "./Field";
import { composeTailwindRenderProps } from "./utils";
import { inputStyles } from "./styles/inputStyles";
import { RefCallBack } from "react-hook-form";

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
  inputRef?: RefCallBack;
}

export const TextField = ({
  label,
  description,
  errorMessage,
  placeholder,
  inputRef,
  isInvalid,
  value,
  onBlur,
  onChange,
  ...props
}: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <AriaTextField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1"
      )}
      onFocusChange={(isFocused) => setIsFocused(isFocused)}
      onBlur={onBlur}
      onChange={onChange}
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
          {props.isRequired && <span className="ml-0.5 text-error-red">*</span>}
        </Label>
      )}
      <Input
        inputRef={inputRef}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={inputStyles}
      />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
};
