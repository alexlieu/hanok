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
import { twMerge } from "tailwind-merge";

export interface DatePickerProps<T extends DateValue>
  extends AriaDatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  unavailableDates?: { start: CalendarDate; end: CalendarDate }[];
  fieldClassName?: string;
}

export function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  unavailableDates,
  fieldClassName,
  ...props
}: DatePickerProps<T>) {
  return (
    <AriaDatePicker
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1"
      )}
    >
      {label && (
        <Label>
          {label}
          <span className="text-error-red pl-1/2">
            {props.isRequired ? "*" : ""}
          </span>
        </Label>
      )}
      <FieldGroup className={twMerge("min-w-[208px] w-auto", fieldClassName)}>
        <DateInput className="flex-1 min-w-[150px] px-2 py-1.5 text-sm" />
        <Button variant="icon" className="w-6 mr-1 outline-offset-0 group">
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
