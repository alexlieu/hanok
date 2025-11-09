import { isValidElement, ReactNode, useId, useState } from "react";
import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";
import { AnimatedFieldError, Description, Input } from "./Field";
import { composeTailwindRenderProps } from "./utils";
import { InputBorderlessTypes, inputStyles } from "./styles/inputStyles";
import { RefCallBack } from "react-hook-form";
import { createLabel } from "./utils/createLabel";
import Tooltip from "../Tooltip";
import { tv } from "tailwind-variants";

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  tooltip?: ReactNode;
  inputRef?: RefCallBack;
  borderless?: InputBorderlessTypes;
  contentInField?: ReactNode;
}

const textFieldStyles = tv({
  extend: inputStyles,
  base: "w-full",
});

export const TextField = ({
  label,
  isRequired,
  description,
  errorMessage,
  placeholder,
  contentInField,
  tooltip,
  borderless,
  inputRef,
  isInvalid,
  value,
  onBlur,
  onChange,
  ...props
}: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const errorMessageId = useId();

  const input = (
    <Input
      inputRef={inputRef}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={placeholder}
      className={(renderProps) =>
        textFieldStyles({ ...renderProps, borderless })
      }
      aria-describedby={errorMessageId}
    />
  );

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
      {createLabel({ label, isRequired, isFocused, isInvalid })}
      {contentInField ? (
        <span className="relative">
          {input}
          {contentInField}
        </span>
      ) : (
        input
      )}
      {description && <Description>{description}</Description>}
      <AnimatedFieldError
        children={errorMessage}
        isInvalid={isInvalid}
        id={errorMessageId}
      />
    </AriaTextField>
  );
};
