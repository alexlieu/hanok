import { Controller, useFormContext } from "react-hook-form";
import { CountryCodeUnion } from "../../schemas/PhoneSchema";
import { DatePicker } from "../ui/aria/DatePicker";
import { I18nProvider } from "react-aria-components";
import { useLoaderData } from "react-router-dom";
import { CheckoutRequiredData } from "../../types/CheckoutType";
import { TextField } from "../ui/aria/TextField";
import { PhoneField } from "../ui/aria/PhoneField";
import { Checkbox, CheckboxGroup } from "../ui/aria/Checkbox";
import Tooltip from "../ui/Tooltip";
import { DEFAULT_COUNTRY_CODE } from "../../schemas/BillingAddressSchema";

const CustomerForm = () => {
  const {
    pickupRules: { firstValidDate, lastValidDate, isHoliday, unavailableDates },
  } = useLoaderData() as CheckoutRequiredData;

  const {
    control,
    trigger,
    formState: { errors, touchedFields, dirtyFields },
  } = useFormContext();

  const legendStyling = "text-xl uppercase tracking-wide mb-2";

  return (
    <fieldset className="mx-auto">
      <legend className="sr-only">Customer details</legend>
      <fieldset className="flex flex-col gap-4 mb-5">
        <legend className={`${legendStyling}`}>Contact details</legend>
        <Controller
          name="fullName"
          control={control}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { invalid, error },
          }) => (
            <TextField
              inputRef={ref}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              label="Full name"
              maxLength={50}
              isRequired
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { invalid, error },
          }) => (
            <TextField
              inputRef={ref}
              value={value}
              onChange={(e) => {
                onChange(e);
                if (touchedFields.email || dirtyFields.email)
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
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { invalid, error },
          }) => (
            <PhoneField
              label="Phone Number"
              isInvalid={!!(invalid || errors.contact)}
              errorMessage={error?.message}
              onBlur={onBlur}
              inputRef={ref}
              phoneNumber={value?.phoneNumber}
              countryCode={value?.countryCode || DEFAULT_COUNTRY_CODE}
              onCountryCodeChange={(newCountryCode: CountryCodeUnion) => {
                onChange({ phoneNumber: "", countryCode: newCountryCode });
              }}
              onPhoneNumberChange={(newPhoneNumber: string) => {
                onChange({ ...value, phoneNumber: newPhoneNumber });
                if (touchedFields.phoneNumber || dirtyFields.phoneNumber)
                  trigger("updatePreference");
                trigger("contact");
              }}
            />
          )}
        />
      </fieldset>
      <fieldset className="flex flex-col gap-4 pb-4">
        <legend className={`${legendStyling}`}>Order preferences</legend>
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
                isDateUnavailable={(date) => isHoliday(date)}
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
              <Checkbox value="sms" className="w-fit">
                SMS
              </Checkbox>
              <Checkbox value="email" className="w-fit">
                Email
              </Checkbox>
            </CheckboxGroup>
          )}
        />
      </fieldset>
    </fieldset>
  );
};

export default CustomerForm;
