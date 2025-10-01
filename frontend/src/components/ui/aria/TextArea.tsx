import {
  TextField,
  TextFieldProps,
  ValidationResult,
  TextArea as AriaTextArea,
} from "react-aria-components";
import { RefCallBack } from "react-hook-form";
import { Description, FieldError } from "./Field";
import { createLabel } from "./utils/createLabel";
import { useState, useEffect, useRef } from "react";
import { composeTailwindRenderProps } from "./utils";
import { inputStyles } from "./styles/inputStyles";
import { tv } from "tailwind-variants";

const textAreaStyles = tv({
  extend: inputStyles,
  // textarea elements are treated as inline elements by default, which causes a few pixels of extra space to be add
  // to the bottom to align the element with the baseline of the text.
  base: "block resize-none min-h-[4.5rem] px-2 py-1.5 w-full overflow-hidden border-none text-start",
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
  maxLength = 250,
  inputRef,
  isRequired,
  isInvalid,
  errorMessage,
  onBlur,
  onChange,
  ...props
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  // Handle textarea resize
  useEffect(() => {
    const handleResize = () => {
      adjustHeight();
    };

    let resizeObserver: ResizeObserver | null = null;
    if (textareaRef.current) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(textareaRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  const handleChange = (value: string) => {
    if (onChange) {
      onChange(value);
    }
    // Use setTimeout to ensure the DOM has updated
    setTimeout(adjustHeight, 0);
  };

  return (
    <TextField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1 transition-transform"
      )}
      onBlur={onBlur}
      onChange={handleChange}
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
          ref={(element) => {
            if (inputRef) {
              inputRef(element);
            }
            textareaRef.current = element;
          }}
          maxLength={maxLength}
          className={textAreaStyles()}
        />
        <div
          className={`w-full flex items-center justify-start border-t-2 ${
            isFocused ? "border-brand-colour-4" : "border-brand-colour-5"
          }`}
        >
          <span
            className={`text-sm text-brand-colour-5 text-center select-none pointer-events-none px-[0.3rem] `}
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
