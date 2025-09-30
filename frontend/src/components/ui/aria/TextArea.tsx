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
  base: "resize-none h-[5lh] px-2 py-1.5 w-full border-none",
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
      {createLabel({ label, isRequired, isFocused, isInvalid })}
      <div
        className={`relative w-full ${inputStyles({
          isFocused,
          isInvalid,
        })}`}
      >
        <AriaTextArea
          ref={inputRef}
          rows={1}
          maxLength={maxLength}
          className={textAreaStyles()}
        />
        <div
          className={`w-full flex items-center justify-start border-t-2 ${
            isFocused ? "border-brand-colour-4" : "border-brand-colour-5"
          }`}
        >
          <span
            className={`text-sm text-center text-black select-none pointer-events-none px-[0.3rem] `}
          >
            {value ? value.length : 0}/{maxLength}
          </span>
        </div>
      </div>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  );
}
