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
import { Description, FieldError, FieldGroup } from "./Field";
import { Popover } from "./Popover";
import { composeTailwindRenderProps } from "./utils";
import { CalendarDate } from "@internationalized/date";
import { inputStyles } from "./styles/inputStyles";
import { tv } from "tailwind-variants";
import { RefCallBack } from "react-hook-form";
import { useState } from "react";
import { createLabel } from "./utils/createLabel";

const fieldStyles = tv({
  extend: inputStyles,
  base: "min-w-[208px] w-auto focus-within:delay-50",
});

export interface DatePickerProps<T extends DateValue>
  extends AriaDatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  inputRef?: RefCallBack;
  unavailableDates?: { start: CalendarDate; end: CalendarDate }[];
}

export const DatePicker = ({
  label,
  description,
  errorMessage,
  inputRef,
  unavailableDates,
  isInvalid,
  value,
  onChange,
  onBlur,
  ...props
}: DatePickerProps<DateValue>) => {
  const [isFocused, setIsFocused] = useState(false);

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
      onFocusChange={setIsFocused}
    >
      {createLabel({ label, isFocused })}
      <FieldGroup className={fieldStyles}>
        <DateInput
          inputRef={inputRef}
          className="flex-1 min-w-[150px] px-2 py-1.5"
        />
        <Button
          variant="icon"
          className="w-6 mr-1 focus:ring-offset-0 focus:ring-brand-focus delay-50"
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
};
