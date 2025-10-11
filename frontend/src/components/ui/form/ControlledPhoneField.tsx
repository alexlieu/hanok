import { memo, useCallback } from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FormState,
  UseFormTrigger,
  FieldValues,
} from "react-hook-form";
import { PhoneField } from "../aria/PhoneField";
import { DEFAULT_COUNTRY_CODE } from "../../../schemas/BillingAddressSchema";
import { CountryCodeUnion } from "../../../schemas/PhoneSchema";
import { CheckoutFormValues } from "../../../schemas/CheckoutSchema";

interface ControlledPhoneFieldProps {
  formState: FormState<CheckoutFormValues>;
  field: ControllerRenderProps<FieldValues, "phoneNumber">;
  fieldState: ControllerFieldState;
  trigger: UseFormTrigger<FieldValues>;
}

export const ControlledPhoneField = memo(
  ({
    formState: { errors, touchedFields, dirtyFields },
    field,
    fieldState,
    trigger,
  }: ControlledPhoneFieldProps) => {
    const { onChange, onBlur, value, ref } = field;
    const { invalid, error } = fieldState;
    const handleCountryCodeChange = useCallback(
      (newCountryCode: CountryCodeUnion) => {
        onChange({ phoneNumber: "", countryCode: newCountryCode });
      },
      [onChange]
    );
    const handlePhoneNumberChange = useCallback(
      (newPhoneNumber: string) => {
        onChange({ ...value, phoneNumber: newPhoneNumber });
        if (touchedFields.phoneNumber || dirtyFields.phoneNumber)
          trigger("updatePreference");
        trigger("contact");
      },
      [onChange, value, touchedFields, dirtyFields, trigger]
    );
    return (
      <PhoneField
        label="Phone Number"
        isInvalid={!!(invalid || errors.contact)}
        errorMessage={error?.message}
        onBlur={onBlur}
        inputRef={ref}
        phoneNumber={value?.phoneNumber}
        countryCode={value?.countryCode || DEFAULT_COUNTRY_CODE}
        onCountryCodeChange={handleCountryCodeChange}
        onPhoneNumberChange={handlePhoneNumberChange}
      />
    );
  }
);
