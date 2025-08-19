import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutSchema, FormData } from "../../schemas/CheckoutFormSchema";
import Checkbox from "../ui/Checkbox";
import FormError from "./ErrorMessage";
import { useEffect } from "react";
import PhoneInput from "./PhoneInput";
import { PhoneData } from "../../schemas/PhoneSchema";
import ToolTip from "../ui/ToolTip";
import { DatePicker } from "../ui/aria/DatePicker";
import { I18nProvider } from "react-aria-components";
import { useLoaderData } from "react-router-dom";
import { CheckoutRequiredData } from "../../types/CheckoutType";

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

  const methods = useForm<FormData>({
    resolver: zodResolver(CheckoutSchema),
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

  const legendStyling = "text-xl font-medium tracking-wide";

  console.log("unavailable date: ", unavailableDates);

  return (
    <div className="mx-auto">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="">
          <legend className={`${legendStyling}`}>Contact details</legend>
          <div className="flex flex-col">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              {...register("fullName")}
              className={`form-input-base ${
                errors.fullName ? "border-error-red" : "border-gray-300"
              }`}
            />
            <FormError name="fullName" errors={errors} />
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="email">Email</label>
              <ToolTip message="We need either your email or phone number so we can send you updates on your order." />
            </div>
            <input
              id="email"
              {...register("email", { onChange: () => trigger("contact") })}
              className={`form-input-base ${
                errors.contact || errors.email
                  ? "border-error-red"
                  : "border-gray-300"
              }`}
              placeholder="email@example.com"
            />
            <FormError name="email" errors={errors} />
          </div>
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
          <FormError name="contact" errors={errors} />
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
                  fieldClassName="border-2 border-gray-300 invalid:border-error-red ring-offset-[2px]"
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
