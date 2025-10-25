import { memo, useCallback } from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FormState,
  UseFormTrigger,
} from "react-hook-form";
import { PhoneField } from "../aria/PhoneField";
import { DEFAULT_COUNTRY_CODE } from "../../../schemas/BillingAddressSchema";
import { CountryCodeUnion } from "../../../schemas/PhoneSchema";
import { CheckoutFormValues } from "../../../schemas/CheckoutSchema";
import { useServerErrors } from "../../../utils/hooks/features/checkout/useServerErrors";

interface ControlledPhoneFieldProps {
  formState: FormState<CheckoutFormValues>;
  field: ControllerRenderProps<CheckoutFormValues, "phoneNumber">;
  fieldState: ControllerFieldState;
  trigger: UseFormTrigger<CheckoutFormValues>;
  hasContactError: boolean;
}

export const ControlledPhoneField = memo(
  ({
    formState: { errors, touchedFields, dirtyFields, submitCount },
    field,
    fieldState,
    trigger,
    hasContactError: contactError,
  }: ControlledPhoneFieldProps) => {
    const { onChange, onBlur, value, ref } = field;
    const { invalid } = fieldState;

    const handleCountryCodeChange = useCallback(
      (newCountryCode: CountryCodeUnion) => {
        onChange({ phoneNumber: "", countryCode: newCountryCode });
      },
      [onChange]
    );

    const handlePhoneNumberChange = useCallback(
      (newPhoneNumber: string) => {
        onChange({ ...value, phoneNumber: newPhoneNumber });
        if (
          (touchedFields.phoneNumber || dirtyFields.phoneNumber) &&
          (submitCount > 0 || dirtyFields.updatePreference)
        )
          trigger("updatePreference");
        trigger("contact");
      },
      [onChange, value, touchedFields, dirtyFields, submitCount, trigger]
    );

    const serverErrors = useServerErrors();
    const serverError = serverErrors.phoneNumber?.[0]?.message;
    const errorMessage =
      errors?.phoneNumber?.phoneNumber?.message || serverError;
    const invalidState = !!(invalid || contactError || serverError);
    return (
      <PhoneField
        label="Phone Number"
        isInvalid={invalidState}
        errorMessage={errorMessage}
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
