import {
  TextField,
  TextFieldProps,
  ValidationResult,
  TextArea as AriaTextArea,
} from "react-aria-components";
import { RefCallBack } from "react-hook-form";
import { Description, FieldError } from "./Field";
import { createLabel } from "./utils/createLabel";
import { useState } from "react";
import { composeTailwindRenderProps } from "./utils";
import { inputStyles } from "./styles/inputStyles";
import { tv } from "tailwind-variants";

const textAreaStyles = tv({
  extend: inputStyles,
  base: "resize-none h-[8lh] px-2 py-1.5 w-full",
});

export interface TextAreaProps extends TextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  maxLength?: number;
  inputRef?: RefCallBack;
}

export function TextArea({
  label,
  description,
  value,
  maxLength = 500,
  inputRef,
  isRequired,
  isInvalid,
  errorMessage,
  onBlur,
  onChange,
  ...props
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1 transition-transform"
      )}
      onBlur={onBlur}
      onChange={onChange}
      value={value}
      isInvalid={isInvalid}
      onFocusChange={setIsFocused}
    >
      {createLabel({ label, isRequired, isFocused })}
      <AriaTextArea
        ref={inputRef}
        rows={1}
        maxLength={maxLength}
        className={textAreaStyles}
      />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  );
}
