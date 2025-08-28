import { isValidElement, ReactNode, useState } from "react";
import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
} from "react-aria-components";
import { Description, FieldError, Input } from "./Field";
import { composeTailwindRenderProps } from "./utils";
import { inputStyles } from "./styles/inputStyles";
import { RefCallBack } from "react-hook-form";
import { createLabel } from "./utils/createLabel";
import Tooltip from "../Tooltip";

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
  tooltip?: ReactNode;
  inputRef?: RefCallBack;
}

export const TextField = ({
  label,
  isRequired,
  description,
  errorMessage,
  placeholder,
  tooltip,
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
        "relative flex flex-col gap-1"
      )}
      onFocusChange={(isFocused) => setIsFocused(isFocused)}
      onBlur={onBlur}
      onChange={onChange}
      value={value}
      isInvalid={isInvalid}
    >
      {isValidElement(tooltip) && tooltip.type === Tooltip && tooltip}
      {createLabel({ label, isRequired, isFocused })}
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
