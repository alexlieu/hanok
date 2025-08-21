import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Checkbox from "../ui/Checkbox";
import FormError from "./ErrorMessage";
import { useEffect, useMemo } from "react";
import PhoneInput from "./PhoneInput";
import { PhoneData } from "../../schemas/PhoneSchema";
import ToolTip from "../ui/ToolTip";
import { DatePicker } from "../ui/aria/DatePicker";
import { I18nProvider } from "react-aria-components";
import { useLoaderData } from "react-router-dom";
import { CheckoutRequiredData } from "../../types/CheckoutType";
import createCustomerFormSchema from "../../schemas/createCustomerFormSchema";
import { z } from "zod/v4";
import { TextField } from "../ui/aria/TextField";

// Compile-time VS Runtime
// TS needs the type definition when it needs compile the code, BEFORE the component renders.
// So we it needs to be defined outside of the component, deriving it statically from the return type of the schema creation function.

type CustomerFormSchemaType = ReturnType<typeof createCustomerFormSchema>;

type FormData = z.infer<CustomerFormSchemaType["schema"]>;

const CustomerForm: React.FC = () => {
  const {
    pickupRules: { firstValidDate, lastValidDate, isHoliday, unavailableDates },
  } = useLoaderData() as CheckoutRequiredData;

  const DEFAULT_VALUES = {
    fullName: "",
    email: "",
    phoneNumber: { countryCode: "GB", phoneNumber: undefined },
    emailUpdate: false,
    smsUpdate: false,
    pickupDate: firstValidDate,
    specialInstructions: "",
  };

  const { schema } = useMemo(() => {
    return createCustomerFormSchema(isHoliday, {
      start: firstValidDate,
      end: lastValidDate,
    });
  }, [isHoliday, firstValidDate, lastValidDate]);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    trigger,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  console.log(errors);

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log(data);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const legendStyling = "text-xl font-medium tracking-wide mb-5";

  return (
    <div className="mx-auto">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
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
                ref={ref}
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
                ref={ref}
                value={value}
                onChange={(e) => {
                  onChange(e);
                  trigger("contact");
                }}
                onBlur={onBlur}
                label="Email"
                maxLength={50}
                isInvalid={!!(invalid || errors.contact)}
                errorMessage={error?.message || errors.contact?.message}
              />
            )}
          />
          <div className="flex flex-col">
            <label htmlFor="">Phone number</label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <PhoneInput
                  phoneData={value}
                  onPhoneDataChange={(data: PhoneData) => {
                    onChange(data);
                    trigger("contact");
                  }}
                  onBlur={onBlur}
                  inputRef={ref}
                  watch={watch}
                  errors={!!(errors.contact || errors.phoneNumber)}
                />
              )}
            />
            <FormError name="phoneNumber" errors={errors} />
          </div>
          {/* <FormError name="contact" errors={errors} /> */}
        </fieldset>
        <fieldset className="flex flex-col">
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
                  ref={ref}
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
          <div>
            <p>How would you like to receive updates?</p>
            <FormError name="update" errors={errors} />
            <Checkbox
              register={register}
              name="emailUpdate"
              displayLabel="Email Update"
              onChange={() => trigger("update")}
            />
            <FormError name="emailUpdate" errors={errors} />
            <Checkbox
              register={register}
              name="smsUpdate"
              displayLabel="SMS Update"
              onChange={() => trigger("update")}
            />
          </div>
          <FormError name="smsUpdate" errors={errors} />
          <div className="flex flex-col">
            <label htmlFor="special-instructions">
              Special instructions (optional)
            </label>
            <input
              type="text"
              name="special-instructions"
              className="form-input-base border-gray-300"
            />
          </div>
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
      </form>
    </div>
  );
};

export default CustomerForm;
