import { LuCalendar } from "react-icons/lu";
import {
  DatePicker as AriaDatePicker,
  DatePickerProps as AriaDatePickerProps,
  DateRange,
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
import { RefCallBack } from "react-hook-form";
import { useState } from "react";
import { createLabel } from "./utils/createLabel";

export interface DatePickerProps<T extends DateValue>
  extends AriaDatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  inputRef?: RefCallBack;
  unavailableDates?: DateRange[];
}

export const DatePicker = ({
  label,
  description,
  errorMessage,
  isRequired,
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
      {createLabel({ label, isRequired, isFocused, isInvalid })}
      <FieldGroup
        className={`min-w-[208px] w-auto ${
          isFocused && !isInvalid && "border-brand-colour-4"
        }`}
      >
        <DateInput
          inputRef={inputRef}
          className="flex-1 min-w-[150px] px-2 py-1.5 text-sm"
        />
        <Button variant="icon" className="w-6 mr-1 relative">
          <LuCalendar aria-hidden className={`w-4 h-4`} strokeWidth={3} />
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
