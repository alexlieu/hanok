import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutSchema, FormData } from "../../schemas/checkoutFormSchema";
import NameInput from "./NameInput";
import DateInput from "./DateInput";
import Checkbox from "../ui/Checkbox";
import ErrorMessage from "./ErrorMessage";
import { useEffect } from "react";

const DEFAULT_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  emailUpdate: false,
  smsUpdate: false,
  specialInstructions: "",
};

const CheckoutForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    getFieldState,
    watch,
    setValue,
    reset,
    formState: { errors, dirtyFields, isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    criteriaMode: "all",
  });

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log(data);
  };

  // useEffect(() => {
  //   const subscription = watch((data) => {
  //     console.log(data);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);
  // console.log("Touched fields: ", touchedFields);
  // console.log("Dirty fields: ", dirtyFields);
  // console.log("Errors:", errors);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const legendStyling = "text-xl font-medium tracking-wide";

  const isEmailCheckboxDisabled =
    !dirtyFields.email || getFieldState("email").invalid;
  const isSmsCheckboxDisabled =
    !dirtyFields.phoneNumber || getFieldState("phoneNumber").invalid;

  useEffect(() => {
    if (isEmailCheckboxDisabled) {
      setValue("emailUpdate", false);
    }
    if (isSmsCheckboxDisabled) {
      setValue("smsUpdate", false);
    }
  }, [isEmailCheckboxDisabled, isSmsCheckboxDisabled, setValue, watch]);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend className={`${legendStyling}`}>Contact details</legend>
        <NameInput
          name="firstName"
          displayLabel="First Name"
          register={register}
          error={errors.firstName}
          required
        />
        <NameInput
          name="lastName"
          displayLabel="Last Name"
          register={register}
          error={errors.lastName}
          required
        />
        <ErrorMessage error={errors.contactMethod} />
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" {...register("email")} />
          <ErrorMessage error={errors.email} />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input id="phoneNumber" {...register("phoneNumber")} />
          <ErrorMessage error={errors.phoneNumber} />
        </div>
      </fieldset>
      <fieldset className="flex flex-col">
        <legend className={`${legendStyling}`}>Order preferences</legend>
        <DateInput
          name="pickup"
          register={register}
          displayLabel="What is your preferred pickup date?"
          error={errors.pickup}
        />
        <div>
          <p>How would you like to receive updates?</p>
          <ErrorMessage error={errors.updateChoice} />
          <Checkbox
            register={register}
            name="emailUpdate"
            displayLabel="Email Update"
            disabled={isEmailCheckboxDisabled}
          />
          <ErrorMessage error={errors.emailUpdate} />
          <Checkbox
            register={register}
            name="smsUpdate"
            displayLabel="SMS Update"
            disabled={isSmsCheckboxDisabled}
          />
        </div>
        <ErrorMessage error={errors.smsUpdate} />
        <label htmlFor="special-instructions">
          Special instructions (optional)
        </label>
        <input type="text" name="special-instructions" />
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
  );
};

export default CheckoutForm;
