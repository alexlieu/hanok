import {
  DateField as AriaDateField,
  DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  DateInputProps as AriaDateInputProps,
  DateSegment,
  DateValue,
  ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Description, FieldError, Label } from "./Field";
import { fieldGroupStyles } from "./styles/fieldGroupStyles";
import { composeTailwindRenderProps } from "./utils";
import { RefCallBack } from "react-hook-form";

export interface DateFieldProps<T extends DateValue>
  extends AriaDateFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DateField<T extends DateValue>({
  label,
  description,
  errorMessage,
  ...props
}: DateFieldProps<T>) {
  return (
    <AriaDateField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1"
      )}
    >
      {label && <Label>{label}</Label>}
      <DateInput />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaDateField>
  );
}

const segmentStyles = tv({
  base: "inline p-0.5",
  variants: {
    isPlaceholder: {
      true: "text-gray-600 italic",
    },
    isDisabled: {
      true: "text-gray-200",
    },
    isFocused: {
      true: "bg-brand-colour-2 text-default-bg outline-none",
    },
  },
});

export interface DateInputProps extends Omit<AriaDateInputProps, "children"> {
  inputRef?: RefCallBack;
}

export const DateInput = (props: DateInputProps) => {
  return (
    <AriaDateInput
      ref={props.inputRef}
      className={(renderProps) =>
        fieldGroupStyles({
          ...renderProps,
          class: "block min-w-[150px] px-2 py-1.5 text-sm",
        })
      }
      {...props}
    >
      {(segment) => <DateSegment segment={segment} className={segmentStyles} />}
    </AriaDateInput>
  );
};
