import { UseFormRegister, Path, FieldErrors } from "react-hook-form";
import { FormData } from "../../schemas/CheckoutFormSchema";
import {
  formatDateString,
  getFirstValidDate,
  getLastValidDate,
} from "../../validator/PickupDateValidator";
import FormError from "./ErrorMessage";

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
        min={formatDateString(getFirstValidDate())}
        max={formatDateString(getLastValidDate())}
      />
      <FormError name="pickup" errors={errors} />
    </div>
  );
};

export default DateInput;
