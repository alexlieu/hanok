import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "../ui/aria/DatePicker";
import { DateValue, I18nProvider } from "react-aria-components";
import { useLoaderData } from "react-router-dom";
import { CheckoutRequiredData } from "../../types/CheckoutType";
import { TextField } from "../ui/aria/TextField";
import { Checkbox, CheckboxGroup } from "../ui/aria/Checkbox";
import Tooltip from "../ui/Tooltip";
import { isDateInRanges } from "../../utils/dateUtils";
import { ControlledPhoneField } from "../ui/form/ControlledPhoneField";
import { useCallback } from "react";
import { CheckoutFormValues } from "../../schemas/CheckoutSchema";
import { useServerErrors } from "../../utils/hooks/features/checkout/useServerErrors";

const CustomerForm = () => {
  const {
    pickupRules: { firstValidDate, lastValidDate, unavailableDates },
  } = useLoaderData() as CheckoutRequiredData;

  const { control, trigger, formState } = useFormContext<CheckoutFormValues>();

  const { errors, touchedFields, dirtyFields, submitCount } = formState;

  const serverErrors = useServerErrors();

  const isDateUnavailable = useCallback(
    (date: DateValue) => isDateInRanges(date, unavailableDates),
    [unavailableDates]
  );

  return (
    <>
      <fieldset className="grid grid-cols-1 lg:grid-cols-2 gap-[0.7rem]">
        <legend className="lowercase tracking-wide text-lg font-medium mb-2">
          contact details
        </legend>
        <Controller
          name="fullName"
          control={control}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { invalid, error },
          }) => {
            const zodError = error?.message;
            const serverError = serverErrors.fullName?.[0]?.message;
            const errorMessage = zodError || serverError;
            return (
              <TextField
                inputRef={ref}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                label="Full name"
                maxLength={50}
                isRequired
                isInvalid={invalid || !!serverError}
                errorMessage={errorMessage}
                className="lg:col-span-2"
              />
            );
          }}
        />
        <Controller
          name="email"
          control={control}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { invalid, error },
          }) => {
            const zodError = error?.message;
            const serverError = serverErrors.email?.[0]?.message;
            const contactError = errors.contact?.message;
            const errorMessage = zodError || serverError || contactError;
            const invalidState = !!(invalid || serverError || contactError);
            return (
              <TextField
                inputRef={ref}
                value={value}
                onChange={(e) => {
                  onChange(e);
                  if (
                    (touchedFields.email || dirtyFields.email) &&
                    (submitCount > 0 || dirtyFields.updatePreference)
                  )
                    trigger("updatePreference");
                  trigger("contact");
                }}
                onBlur={onBlur}
                label="Email"
                tooltip={
                  <Tooltip
                    className="absolute top-0 right-0 focus:ring-offset-0"
                    buttonAriaLabel="More information on why we need your contact details"
                  >
                    <p>
                      We need either your email or phone number so we can keep
                      you up to date on your order.
                    </p>
                  </Tooltip>
                }
                placeholder="name@email.com"
                maxLength={50}
                isInvalid={invalidState}
                errorMessage={errorMessage}
                className="lg:col-start-1"
              />
            );
          }}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field, fieldState }) => (
            <ControlledPhoneField
              formState={formState}
              field={field}
              fieldState={fieldState}
              trigger={trigger}
              hasContactError={!!errors.contact}
            />
          )}
        />
      </fieldset>
      <fieldset className="space-y-[0.7rem]">
        <legend className="lowercase tracking-wide text-lg font-medium mb-2">
          pickup and updates
        </legend>
        <I18nProvider locale="en-GB">
          <Controller
            name="pickupDate"
            control={control}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { invalid, error },
            }) => {
              const zodError = error?.message;
              const serverError = serverErrors.pickupDate?.[0]?.message;
              const errorMessage = zodError || serverError;
              const invalidState = !!(invalid || serverError);
              return (
                <DatePicker
                  isInvalid={invalidState}
                  value={value}
                  inputRef={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  errorMessage={errorMessage}
                  minValue={firstValidDate}
                  maxValue={lastValidDate}
                  isDateUnavailable={isDateUnavailable}
                  unavailableDates={unavailableDates}
                  isRequired
                  label="What is your preferred pickup date?"
                />
              );
            }}
          />
        </I18nProvider>
        <Controller
          name="updatePreference"
          control={control}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { invalid, error },
          }) => {
            const zodError = error?.message;
            const serverError = serverErrors.updatePreference?.[0]?.message;
            const errorMessage = zodError || serverError;
            const invalidState = !!(invalid || serverError);
            return (
              <CheckboxGroup
                isInvalid={invalidState}
                value={value}
                onChange={(pref) => {
                  onChange(pref);
                  trigger("updatePreference");
                }}
                inputRef={ref}
                onBlur={onBlur}
                errorMessage={errorMessage}
                isRequired
                label="How should we update you on your order?"
              >
                <Checkbox
                  value="email"
                  className="w-fit"
                  name="update-preference-email"
                >
                  Email
                </Checkbox>
                <Checkbox
                  value="sms"
                  className="w-fit"
                  name="update-preference-sms"
                >
                  SMS
                </Checkbox>
              </CheckboxGroup>
            );
          }}
        />
      </fieldset>
    </>
  );
};

export default CustomerForm;
