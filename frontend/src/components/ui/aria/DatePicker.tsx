import { LuCalendar } from "react-icons/lu";
import {
  DatePicker as AriaDatePicker,
  DatePickerProps as AriaDatePickerProps,
  DateValue,
  ValidationResult,
} from "react-aria-components";
import { Button } from "./Button";
import { Calendar } from "./Calendar";
import { DateInput } from "./DateField";
import { Dialog } from "./Dialog";
import { Description, FieldError, FieldGroup, Label } from "./Field";
import { Popover } from "./Popover";
import { composeTailwindRenderProps } from "./utils";
import { CalendarDate } from "@internationalized/date";
import { forwardRef } from "react";
import { inputStyles } from "./TextField";
import { tv } from "tailwind-variants";

const fieldStyles = tv({
  extend: inputStyles,
  base: "min-w-[208px] w-auto",
});

export interface DatePickerProps<T extends DateValue>
  extends AriaDatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  unavailableDates?: { start: CalendarDate; end: CalendarDate }[];
}

export const DatePicker = forwardRef<
  HTMLDivElement,
  DatePickerProps<DateValue>
>(
  (
    {
      label,
      description,
      errorMessage,
      unavailableDates,
      isInvalid,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    return (
      <AriaDatePicker
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        isInvalid={isInvalid}
        {...props}
        className={composeTailwindRenderProps(
          props.className,
          "flex flex-col gap-1"
        )}
      >
        {label && (
          <Label>
            {label}
            <span className="text-error-red ml-0.5">
              {props.isRequired ? "*" : ""}
            </span>
          </Label>
        )}
        <FieldGroup className={fieldStyles}>
          <DateInput ref={ref} className="flex-1 min-w-[150px] px-2 py-1.5" />
          <Button
            variant="icon"
            className="w-6 mr-1 focus:ring-2 focus:ring-offset-0 focus:ring-brand-focus"
          >
            <LuCalendar aria-hidden className="w-4 h-4" />
          </Button>
        </FieldGroup>
        {description && <Description>{description}</Description>}
        <FieldError>{errorMessage}</FieldError>
        <Popover>
          <Dialog className="bg-default-bg outline-2 outline-gray-300">
            <Calendar unavailableDates={unavailableDates} />
          </Dialog>
        </Popover>
      </AriaDatePicker>
    );
  }
);
