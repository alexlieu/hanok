import { UseFormRegister, Path, FieldErrors } from "react-hook-form";
import { FormData } from "../../schemas/CheckoutFormSchema";
import {
  getFirstValidDate,
  getLastValidDate,
} from "../../validator/PickupDateValidator";
import FormError from "./ErrorMessage";
import { useLoaderData } from "react-router-dom";
import { CheckoutRequiredData } from "../../types/CheckoutType";
import { format } from "date-fns";

type DateInputProps = {
  name: Path<FormData>;
  register: UseFormRegister<FormData>;
  displayLabel: string;
  errors: FieldErrors;
};

const DateInput: React.FC<DateInputProps> = ({
  name,
  register,
  displayLabel,
  errors,
}) => {
  const {
    pickupRules: {
      requiredLeadDays,
      maxMonth,
      cutOffHour,
      cutOffMin,
      holidayRanges,
      timezone,
    },
  } = useLoaderData() as CheckoutRequiredData;
  console.log(holidayRanges);
  const firstValidDate = getFirstValidDate(
    requiredLeadDays,
    cutOffHour,
    cutOffMin,
    timezone
  );
  const lastValidDate = getLastValidDate(
    maxMonth,
    cutOffHour,
    cutOffMin,
    timezone
  );
  return (
    <div className="flex flex-col">
      <label htmlFor={name}>{displayLabel}</label>
      <input
        className={`form-input-base ${
          errors.pickup ? "border-error-red" : "border-gray-300"
        }`}
        type="date"
        id={name}
        {...register(name, {
          setValueAs: (v) => {
            if (!v) return undefined;
            const date = new Date(v);
            date.setUTCHours(0, 0, 0, 0);
            return date.toISOString();
          },
        })}
        min={format(firstValidDate, "yyyy-MM-dd")}
        max={format(lastValidDate, "yyyy-MM-dd")}
      />
      <FormError name="pickup" errors={errors} />
    </div>
  );
};

export default DateInput;
