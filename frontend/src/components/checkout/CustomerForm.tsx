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

  const {
    control,
    trigger,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();

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
            formState: { touchedFields, dirtyFields, submitCount },
          }) => (
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
                    We need either your email or phone number so we can keep you
                    up to date on your order.
                  </p>
                </Tooltip>
              }
              placeholder="name@email.com"
              maxLength={50}
              isInvalid={!!(invalid || errors.contact)}
              errorMessage={
                error?.message ||
                (typeof errors.contact?.message === "string"
                  ? errors.contact.message
                  : undefined)
              }
              className="lg:col-start-1"
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field, fieldState, formState }) => (
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
            }) => (
              <DatePicker
                isInvalid={invalid}
                value={value}
                inputRef={ref}
                onChange={onChange}
                onBlur={onBlur}
                errorMessage={error?.message}
                minValue={firstValidDate}
                maxValue={lastValidDate}
                isDateUnavailable={isDateUnavailable}
                unavailableDates={unavailableDates}
                isRequired
                label="What is your preferred pickup date?"
              />
            )}
          />
        </I18nProvider>
        <Controller
          name="updatePreference"
          control={control}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { invalid, error },
          }) => (
            <CheckboxGroup
              isInvalid={invalid}
              value={value}
              onChange={(pref) => {
                onChange(pref);
                trigger("updatePreference");
              }}
              inputRef={ref}
              onBlur={onBlur}
              errorMessage={error?.message}
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
          )}
        />
      </fieldset>
    </>
  );
};

export default CustomerForm;
