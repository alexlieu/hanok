import {
  FieldErrorProps,
  Group,
  GroupProps,
  InputProps as AriaInputProps,
  LabelProps,
  FieldError as RACFieldError,
  Input as RACInput,
  Label as RACLabel,
  Text,
  TextProps,
  composeRenderProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { composeTailwindRenderProps } from "./utils";
import { RefCallBack } from "react-hook-form";
import { fieldGroupStyles } from "./styles/fieldGroupStyles";

export function Label(props: LabelProps) {
  return (
    <RACLabel
      {...props}
      className={twMerge(
        "text-sm text-black font-light cursor-default w-fit",
        props.className
      )}
    />
  );
}

export function Description(props: TextProps) {
  return (
    <Text
      {...props}
      slot="description"
      className={twMerge("text-sm text-gray-600", props.className)}
    />
  );
}

export function FieldError(props: FieldErrorProps) {
  return (
    <RACFieldError
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "text-error-red text-sm"
      )}
    />
  );
}

export function FieldGroup(props: GroupProps) {
  return (
    <Group
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupStyles({ ...renderProps, className })
      )}
    />
  );
}

export interface InputProps extends AriaInputProps {
  inputRef?: RefCallBack;
}

export const Input = (props: InputProps) => {
  return (
    <RACInput
      {...props}
      ref={props.inputRef}
      className={composeTailwindRenderProps(props.className, "px-2 py-1.5")}
      placeholder={props.placeholder}
    />
  );
};
