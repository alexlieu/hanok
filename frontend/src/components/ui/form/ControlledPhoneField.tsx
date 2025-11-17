import { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { PhoneField } from "../aria/PhoneField";
import { DEFAULT_COUNTRY_CODE } from "../../../schemas/BillingAddressSchema";
import { CountryCodeUnion } from "../../../schemas/PhoneSchema";
import { CheckoutFormValues } from "../../../schemas/CheckoutSchema";
import { useServerErrors } from "../../../utils/hooks/features/checkout/useServerErrors";
import { useDebouncedFormTrigger } from "../../../utils/hooks/features/checkout/useDebouncedFormTrigger";

export const ControlledPhoneField = memo(() => {
  const { control, trigger, formState, setValue } =
    useFormContext<CheckoutFormValues>();
  const { errors, touchedFields, dirtyFields, submitCount } = formState;
  const debouncedTrigger = useDebouncedFormTrigger();
  const { validationErrors } = useServerErrors();
  const triggerUpdatePreferenceValidation: boolean = !!(
    (touchedFields.phoneNumber || dirtyFields.phoneNumber) &&
    (submitCount > 0 || dirtyFields.updatePreference)
  );

  const contactError = errors.contact?.message;
  const serverError = validationErrors.phoneNumber?.[0]?.message;
  const errorMessage = errors?.phoneNumber?.phoneNumber?.message || serverError;

  return (
    <Controller
      name="phoneNumber"
      control={control}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { invalid },
      }) => {
        const handleCountryCodeChange = (newCountryCode: CountryCodeUnion) => {
          onChange({ phoneNumber: "", countryCode: newCountryCode });
        };
        const handlePhoneNumberChange = (newPhoneNumber: string) => {
          setValue(
            "phoneNumber",
            {
              phoneNumber: newPhoneNumber,
              countryCode: value?.countryCode || DEFAULT_COUNTRY_CODE,
            },
            {
              shouldValidate: false,
              shouldDirty: true,
            }
          );
          if (
            submitCount > 0 ||
            touchedFields.phoneNumber ||
            touchedFields.email
          ) {
            const fieldsToValidate: (keyof CheckoutFormValues)[] = [
              "phoneNumber",
              "contact",
            ];
            if (triggerUpdatePreferenceValidation) {
              fieldsToValidate.push("updatePreference");
            }
            debouncedTrigger(fieldsToValidate);
          }
        };
        const invalidState = !!(invalid || contactError || serverError);
        return (
          <PhoneField
            label="Phone Number"
            isInvalid={invalidState}
            errorMessage={errorMessage}
            onBlur={() => {
              onBlur();
              if (triggerUpdatePreferenceValidation)
                trigger(["updatePreference"]);
              trigger(["phoneNumber", "contact"]);
            }}
            inputRef={ref}
            phoneNumber={value?.phoneNumber}
            countryCode={value?.countryCode || DEFAULT_COUNTRY_CODE}
            onCountryCodeChange={handleCountryCodeChange}
            onPhoneNumberChange={handlePhoneNumberChange}
          />
        );
      }}
    />
  );
});
