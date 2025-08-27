import {
  useForm,
  SubmitHandler,
  Controller,
  Resolver,
  Form,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { CountryCodeUnion } from "../../schemas/PhoneSchema";
import { DatePicker } from "../ui/aria/DatePicker";
import { I18nProvider } from "react-aria-components";
import { useLoaderData } from "react-router-dom";
import { CheckoutRequiredData } from "../../types/CheckoutType";
import createCustomerFormSchema from "../../schemas/createCustomerFormSchema";
import { z } from "zod/v4";
import { TextField } from "../ui/aria/TextField";
import { PhoneField } from "../ui/aria/PhoneField";
import { Checkbox, CheckboxGroup } from "../ui/aria/Checkbox";
import { TextArea } from "../ui/aria/TextArea";

// Compile-time VS Runtime
// TS needs the type definition when it needs compile the code, BEFORE the component renders.
// So we it needs to be defined outside of the component, deriving it statically from the return type of the schema creation function.

type CustomerFormSchemaType = ReturnType<typeof createCustomerFormSchema>;

type FormData = z.infer<CustomerFormSchemaType["schema"]>;

const defaultCountryCode = "GB" as CountryCodeUnion;

const CustomerForm: React.FC = () => {
  const {
    pickupRules: { firstValidDate, lastValidDate, isHoliday, unavailableDates },
  } = useLoaderData() as CheckoutRequiredData;

  const DEFAULT_VALUES = {
    fullName: "",
    email: "",
    phoneNumber: { countryCode: defaultCountryCode, phoneNumber: "" },
    defaultValue: [],
    pickupDate: undefined,
    specialInstructions: undefined,
  };

  const { schema } = useMemo(() => {
    return createCustomerFormSchema(isHoliday, {
      start: firstValidDate,
      end: lastValidDate,
    });
  }, [isHoliday, firstValidDate, lastValidDate]);

  const methods = useForm<FormData>({
    // A problem arises when the schema is passed to useForm
    // useForm uses a generic type TFieldValues that it uses for validation.
    // Somtimes with the way types are inferred and passed, the expected type can become slightly more general
    // e.g. {countryCode: string}
    // So we cast the resolver to match the FormData type
    // We cast to unknown first as this is the safest way to perform a type assertion that breaks the direct type compatibility check.
    resolver: zodResolver(schema) as unknown as Resolver<FormData>,
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const {
    // register,
    // handleSubmit,
    control,
    trigger,
    reset,
    formState: { errors },
  } = methods;

  console.log(errors);

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log(data);
  };

  const legendStyling = "text-xl font-medium tracking-wide mb-5";

  return (
    <div className="mx-auto">
      <Form
        className="flex flex-col"
        control={control}
        onSubmit={({ data }) => onSubmit(data)}
      >
        <fieldset className="flex flex-col gap-4">
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
                  trigger("contact");
                  trigger("updatePreference");
                }}
                onBlur={onBlur}
                label="Email"
                placeholder="name@email.com"
                maxLength={50}
                isInvalid={!!(invalid || errors.contact)}
                errorMessage={error?.message || errors.contact?.message}
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
                countryCode={value?.countryCode || defaultCountryCode}
                onCountryCodeChange={(newCountryCode: CountryCodeUnion) => {
                  onChange({ phoneNumber: "", countryCode: newCountryCode });
                }}
                onPhoneNumberChange={(newPhoneNumber: string) => {
                  onChange({ ...value, phoneNumber: newPhoneNumber });
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
                  onChange={onChange}
                  inputRef={ref}
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
                onChange={onChange}
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
          <Controller
            name="specialInstructions"
            control={control}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { invalid, error },
            }) => (
              <TextArea
                label="Special instructions"
                isInvalid={invalid}
                value={value}
                onChange={onChange}
                inputRef={ref}
                onBlur={onBlur}
                maxLength={500}
                errorMessage={error?.message}
              />
            )}
          />
        </fieldset>
        <button type="submit">Place Order</button>
        <button
          type="reset"
          onClick={() => {
            reset();
          }}
        >
          Clear form
        </button>
      </Form>
    </div>
  );
};

export default CustomerForm;
